import Vue from 'vue';
import VueRouter from 'vue-router';
import EntryFeed from './components/Entry/EntryFeed.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import SupporterPage from './components/Supporter/SupporterPage.vue';
import SupportedPage from './components/Supported/SupportedPage.vue';
import SupportedRequestPage from './components/Supported/SupportedRequestPage.vue';
import SupporterRequestPage from './components/Supporter/SupporterRequestPage.vue';
import OneEntryPage from './components/Entry/OneEntryPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: EntryFeed},
  {path: '/supporter', name: 'Supporters', component: SupporterPage},
  {path: '/supported', name: 'Supported', component: SupportedPage},
  {path: '/supportedRequest', name: 'Supported Request', component: SupportedRequestPage},
  {path: '/supporterRequest', name: 'Supporter Request', component: SupporterRequestPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/viewEntry', name: 'View Entry', component: OneEntryPage, props: true},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }

    if (to.name === 'Supporter' && !router.app.$store.state.username){
      next({name: 'Home'});
    }

    if (to.name === 'Supported' && !router.app.$store.state.username){
      next({name: 'Home'});
    }
  }

  next();
});

export default router;
