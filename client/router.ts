import Vue from 'vue';
import VueRouter from 'vue-router';
import EntryFeed from './components/Entry/EntryFeed.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import SupporterPage from './components/Supporter/SupporterPage.vue';
import SupportedPage from './components/Supported/SupportedPage.vue';
// import SupportedRequestPage from './components/Supported/SupportedRequestPage.vue';
// import SupporterRequestPage from './components/Supporter/SupporterRequestPage.vue';
import SupportedEntriesFeed from './components/Supported/SupportedEntriesFeed.vue';
import EntryPage from './components/Entry/EntryPage.vue';
import FlaggedPage from './components/Flag/FlaggedPage.vue';
import SharePage from './components/Share/SharePage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: EntryFeed},
  {path: '/supporter', name: 'Supporter', component: SupporterPage},
  {path: '/supported', name: 'Supported', component: SupportedPage},
  // {path: '/supportedRequest', name: 'Supported Request', component: SupportedRequestPage},
  // {path: '/supporterRequest', name: 'Supporter Request', component: SupporterRequestPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/flagged', name: 'Flagged Entries', component: FlaggedPage},
  {path: '/Entry', name: 'Entry', component: EntryPage},
  {path: '/share/:shareId', name: 'Share', component: SharePage},
  {path: '/entries', name: 'SupportedEntriesFeed', component: SupportedEntriesFeed},
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

    if ((to.name !== 'Login' && from.name !== 'Share' && to.name !== 'Share') && !router.app.$store.state.username){
      next({name: 'Login'});
      return;
    }
    
    if(to.name == 'Entry' && !router.app.$store.state.entryStatus){
      next({name: 'Home'});
      return;
    }
  }

  next();
});

export default router;
