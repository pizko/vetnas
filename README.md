# Ветеринар на связи — новый сайт (staging)

Предпросмотр: https://pizko.github.io/vetnas/ (закрыт от индексации).
Контент взят с https://vetnasvyaz.ru, адреса страниц сохранены.

Сборка (исходники в `_src/`, рабочая копия — `~/vibecoding/vetnas-v2`):

    python3 src/extract.py                        # тексты с живого сайта -> data/pages.json
    python3 src/media.py                          # фото -> dist/assets/img
    python3 src/build.py --base /vetnas/ --staging
    python3 src/build.py --base /                 # для боевого домена
