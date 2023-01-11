# rundo-gbs-view

## Build Setup
# clone the project
git clone https://coding.runjian.com:12001/rundogbs/rundo-gbs-view.git

# install dependency
npm install

# develop
npm run dev

This will automatically open http://localhost:9528

## Build
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod

## Advanced
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
