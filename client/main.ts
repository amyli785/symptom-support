import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import * as iconRegular from '@fortawesome/free-regular-svg-icons';
import * as iconSolid from '@fortawesome/free-solid-svg-icons';

library.add(iconRegular.faFlag, iconSolid.faFlag);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
