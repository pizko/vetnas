document.addEventListener("DOMContentLoaded", () => {
  let lpContent = document.getElementById("lp_constructor");
  let iframeBody = document;
  let iframeWindow = window;
  let timeout = 20;
  if (lpContent) {
    timeout = 4000;
  }
  setTimeout(() => {
    if (lpContent) {
      let iframe = document.querySelector("#lpc_contructor_iframe");

      if (iframe) {
        iframeBody = iframe.contentDocument.body;
        iframeWindow = iframe.contentWindow;
      }
    }

    const detectedTagId = {
      h1: "lpc-config-h1",
      h2: "lpc-config-h2",
      h3: "lpc-config-h3",
      h4: "lpc-config-h4",
      h5: "lpc-config-h5",
      h6: "lpc-config-h6",
      p: "lpc-config-p",
      button: "lpc-config-button",
      h: "lpc-config-h2-main",
      text: "lpc-config-p-main"
    }

    const configBlockId = "lpc-config-block";

    const configBlock = `
      <div id="${configBlockId}" style="display: none">
        <h1 id="${detectedTagId.h1}"></h1>
        <h2 id="${detectedTagId.h2}"></h2>
        <h3 id="${detectedTagId.h3}"></h3>
        <h4 id="${detectedTagId.h4}"></h4>
        <h5 id="${detectedTagId.h5}"></h5>
        <h6 id="${detectedTagId.h6}"></h6>
        <p id="${detectedTagId.p}"></p>
        <p id="${detectedTagId.button}"></p>
        <p id="${detectedTagId.text}"></p>
        <h2 id="${detectedTagId.h}"></h2>
      </div>
    `;

    let root;
    const contentWrapper = iframeBody.querySelector(".lpc-content-wrapper");
    let content = contentWrapper ? contentWrapper.parentElement : undefined;
    
    try {
	  root = iframeBody.querySelector(".mosaic-wrap >.root");
	} catch (error) {
	  console.log(error.message)
	}

    if (content) {
      let lpcStyleConfig = {};

      const findBackgroundStyles = (content) => {
        const convertRgbToRgba = (color) => {
          if (color.startsWith("rgb(")) {
            return color.replace("rgb(", "rgba(").replace(")", ", 1)");
          }
          return color;
        };

        const isColorOpaque = (color) => {
          const rgbaColor = convertRgbToRgba(color);
          return parseFloat(rgbaColor.split(",")[3]) > 0;
        };

        const getBackgroundColor = (color) => {
          return isColorOpaque(color) ? convertRgbToRgba(color) : null;
        };

        const resultStyles = [];

        const currentElement = content;
        let parent = currentElement;

        while (parent && parent.tagName !== "HTML") {
          const computedStyle = getComputedStyle(parent);
          const currentBackground = computedStyle.backgroundColor;
          const currentBackgroundImage = computedStyle.backgroundImage;
          let currentBackgroundGradient = currentBackgroundImage;

          if (currentBackgroundImage && currentBackgroundImage.includes("gradient")) {
            const imageUrlRegex = /url\("([^"]+)"\)/g;
            const imageUrlMatches = currentBackgroundImage.match(imageUrlRegex);

            if (imageUrlMatches) {
              for (const imageUrlMatch of imageUrlMatches) {
                currentBackgroundGradient = currentBackgroundGradient.replace(imageUrlMatch, "none");
              }
            }
            resultStyles.push(currentBackgroundGradient);
          }

          if (!currentBackgroundImage.includes("linear-gradient")) {
            const bgColor = getBackgroundColor(currentBackground);
            if (bgColor) {
              resultStyles.push(`linear-gradient(to right, ${bgColor} 0%, ${bgColor} 100%)`);
            }
          }
          parent = parent.parentNode;
        }

        return resultStyles;
      };

      const getElementStyles = (elementId, styles) => {
        let element;
        if (elementId === detectedTagId.h1 && root) {
          element = iframeBody.querySelector(".page-title");
          if(!element) {
          	element = iframeBody.querySelector(`#${detectedTagId.h2}`);
          }
        } else {
          element = iframeBody.querySelector(`#${elementId}`);
        }
        
        if(element) {
        	const object = {};
	        const cssObj = iframeWindow.getComputedStyle(element, null);
	
	        styles.forEach((style) => {
	          object[style] = cssObj.getPropertyValue(style) + ";";
	        });
	
	        lpcStyleConfig[elementId] = object;	
        }
      };

      const extractRGB = (color) => {
        const regex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/;
        let match = regex.exec(color);
        return [match[1], match[2], match[3]];
      };

      const checkFontFamily = (fontFamily) => {
        fontFamily = fontFamily.replace(/'/g, '').replace(/"/g, '');
        try {
          if (!document.fonts.check(`12px ${fontFamily}`)) {
            const link = document.createElement("link");
            link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}`;
            link.rel = "stylesheet";
            document.head.appendChild(link);
          }
        } catch (error) {
          console.log(error.message)
        }
      };

      const createCssVariable = (headerColor, textColor) => {
        let textColorBase = extractRGB(textColor);

        return `
          :root {
              --text-color-base: rgb(${textColorBase});
              --text-color-a-005: rgba(${textColorBase}, 0.05);
              --text-color-a-01: rgba(${textColorBase}, 0.1);
              --text-color-a-02: rgba(${textColorBase}, 0.2);
              --text-color-a-03: rgba(${textColorBase}, 0.3);
              --text-color-a-04: rgba(${textColorBase}, 0.4);
              --text-color-a-05: rgba(${textColorBase}, 0.5);
              --text-color-a-06: rgba(${textColorBase}, 0.6);
              --text-color-a-07: rgba(${textColorBase}, 0.7);
              --text-color-a-08: rgba(${textColorBase}, 0.8);
              --text-color-a-09: rgba(${textColorBase}, 0.9);
              --text-color-base-header: ${headerColor};
          }
        `;
      };

      const getAllStyles = () => {
        const styleAttributes = [
          {
            tagId: detectedTagId.h1,
            properties: ["font-family", "font-style", "font-weight"]
          },
          {
            tagId: detectedTagId.h2,
            properties: ["font-family", "font-style", "font-weight"]
          },
          {
            tagId: detectedTagId.h3,
            properties: ["font-family", "font-style", "font-weight"]
          },
          {
            tagId: detectedTagId.h4,
            properties: ["font-family", "font-style", "font-weight"]
          },
          {
            tagId: detectedTagId.h5,
            properties: ["font-family", "font-style", "font-weight"]
          },
          {
            tagId: detectedTagId.h6,
            properties: ["font-family", "font-style", "font-weight"]
          },
          {
            tagId: detectedTagId.p,
            properties: ["font-family", "font-style", "font-weight"]
          },
          {
            tagId: detectedTagId.button,
            properties: ["font-family", "font-style"]
          },
          {
            tagId: detectedTagId.text,
            properties: ["color", "font-family"]
          },
          {
            tagId: detectedTagId.h,
            properties: ["color", "font-family"]
          }
        ];

        if (!content.querySelector(`#${configBlockId}`)) {
          content.insertAdjacentHTML("beforeend", configBlock);
        }

        styleAttributes.forEach(({
          tagId,
          properties
        }) => getElementStyles(tagId, properties));

        try {
          const styleBlock = content.querySelector(`#${configBlockId}`);
          if (styleBlock) {
            styleBlock.remove();
          }
        } catch (e) {
          console.error(e.message);
        }
      };

      const setAllStyles = () => {
        let styleConfig = lpcStyleConfig;
        let headerColor = styleConfig[detectedTagId.h]["color"].replace(";", "");
        let headerFontFamily = styleConfig[detectedTagId.h]["font-family"].split(",");
        let textColor = styleConfig[detectedTagId.text]["color"].replace(";", "");
        let textFontFamily = styleConfig[detectedTagId.text]["font-family"].split(",");

        let bgStyle = `
          :root {
            --content-background-lpc: ${findBackgroundStyles(content)};
          }
        `;

        const generateStyle = (classSelector, styleKey) => {
          const style = styleConfig[styleKey];
          if(style) {
            const cleanedStyle = JSON.stringify(style)
            .replace(/\\"/gm, "&")
            .replace(/"+,|"/gm, "")
            .replace(/&/gm, '"');
          	return `${classSelector} ${cleanedStyle}`;
          }

        };

        const styleClasses = [
          [".lpc-wrap .lp-header-text-1, .lpc-wrap .lp-header-text-2, .lpc-wrap .lp-header-text-3, .lpc-wrap .lp-header-text-4", detectedTagId.p],
          [".lp-button", detectedTagId.button],
          [".lpc-wrap h1, .lpc-wrap .lp-header-title-1", detectedTagId.h1],
          [".lpc-wrap h2, .lpc-wrap .lp-header-title-2", detectedTagId.h2],
          [".lpc-wrap h3, .lpc-wrap .lp-header-title-3", detectedTagId.h3],
          [".lpc-wrap h4, .lpc-wrap .lp-header-title-4", detectedTagId.h4],
          [".lpc-wrap h5, .lpc-wrap .lp-header-title-5", detectedTagId.h5],
          [".lpc-wrap h6, .lpc-wrap .lp-header-title-6", detectedTagId.h6]
        ];

        const styleContent = styleClasses.map(([classSelector, styleKey]) => generateStyle(classSelector, styleKey)).join("\n");

        const style = `
          <style id="lpc-stylesheet">
            ${createCssVariable(headerColor, textColor)}
            ${bgStyle}
            ${styleContent}
          </style>
        `;

        let constructor = document.querySelector("#landing_page_site");
        if (constructor) {
          let lpcStylesheet = document.querySelector("#lpc-stylesheet");
          if (lpcStylesheet) {
            lpcStylesheet.remove();
          }
          let placeToInsert = document.querySelector('script[src="/g/s3/lp/lpc.v4/js/main.js"]');
          placeToInsert.insertAdjacentHTML("afterend", style);
          checkFontFamily(headerFontFamily[0]);
          checkFontFamily(textFontFamily[0]);
        } else {
          let lpcStylesheet = document.querySelector("#lpc-stylesheet");
          if (lpcStylesheet) {
            lpcStylesheet.remove();
          }
          document.querySelector("#lpc-styles-container").innerHTML += style;
        }
      };

      getAllStyles();
      setAllStyles();

      document.addEventListener("dataMediaSourceChange", () => {
        getAllStyles();
        setAllStyles();
      });

      let target = document.querySelector("body");
      let observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
          if (document.querySelectorAll(".s3solution-panel-root").length > 0) {

            $(document).on("click", ".js-panel-themes-list .js-theme-item", () => {
              setTimeout(() => {
                getAllStyles();
                setAllStyles();
              }, 180);
            });

            observer.disconnect();
          }
        });
      });
      let config = {
        attributes: true,
        childList: true,
        characterData: true
      };

      observer.observe(target, config);
    }
  }, timeout);
});