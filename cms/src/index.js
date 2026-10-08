'use strict';

const fs = require('fs');
const path = require('path');

function readSeed(name) {
  const file = path.join(__dirname, '..', 'data', 'seed', name);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

async function upsertCollection(strapi, uid, items, key = 'slug') {
  let created = 0;
  let updated = 0;
  for (const data of items) {
    const existing = await strapi.documents(uid).findMany({
      filters: { [key]: data[key] },
      limit: 1,
    });
    if (existing && existing.length) {
      await strapi.documents(uid).update({ documentId: existing[0].documentId, data });
      updated++;
    } else {
      await strapi.documents(uid).create({ data });
      created++;
    }
  }
  return { created, updated };
}

async function setPublicPermissions(strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' }, populate: ['permissions'] });
  if (!publicRole) return;
  const actions = [
    'api::page.page.find',
    'api::page.page.findOne',
    'api::article.article.find',
    'api::article.article.findOne',
    'api::global.global.find',
  ];
  for (const action of actions) {
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });
    if (!existing) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  }
}

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    try {
      const pages = readSeed('pages.json');
      const articles = readSeed('articles.json');
      const global = readSeed('global.json');

      if (pages) {
        const r = await upsertCollection(strapi, 'api::page.page', pages);
        strapi.log.info(`[seed] pages: +${r.created} / ~${r.updated}`);
      }
      if (articles) {
        const r = await upsertCollection(strapi, 'api::article.article', articles);
        strapi.log.info(`[seed] articles: +${r.created} / ~${r.updated}`);
      }
      if (global) {
        const existing = await strapi.documents('api::global.global').findFirst();
        if (existing) {
          await strapi.documents('api::global.global').update({ documentId: existing.documentId, data: global });
        } else {
          await strapi.documents('api::global.global').create({ data: global });
        }
        strapi.log.info('[seed] global updated');
      }

      await setPublicPermissions(strapi);
      strapi.log.info('[seed] public read permissions set');
    } catch (err) {
      strapi.log.error('[seed] failed: ' + (err && err.stack ? err.stack : err));
    }
  },
};
