import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { BootstrapVue} from 'bootstrap-vue';
import * as iconRegular from '@fortawesome/free-regular-svg-icons';
import * as iconSolid from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

library.add(iconRegular.faFlag, iconSolid.faFlag);
library.add(iconSolid.faPen);
library.add(iconSolid.faTrash);
library.add(iconSolid.faCheck);
library.add(iconSolid.faBan);
library.add(iconSolid.faFaceLaughBeam);
library.add(iconSolid.faFaceSmile);
library.add(iconSolid.faFaceMeh);
library.add(iconSolid.faFaceFrown);
library.add(iconSolid.faFaceSadTear);
library.add(iconSolid.faPlus);
library.add(iconSolid.faX);
library.add(iconSolid.faShareNodes);
library.add(iconSolid.faArrowLeft);
library.add(iconSolid.faHeartPulse);
library.add(iconSolid.faHouse);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
