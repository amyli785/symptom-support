import Vue from 'vue';
import VueRouter from 'vue-router';
import EntryFeed from './components/Entry/EntryFeed.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import SupporterPage from './components/Supporter/SupporterPage.vue';
import SupportingPage from './components/Supporting/SupportingPage.vue';
import SupportingEntriesFeed from './components/Supporting/SupportingEntriesFeed.vue';
import EntryPage from './components/Entry/EntryPage.vue';
import FlaggedPage from './components/Flag/FlaggedPage.vue';
import SharePage from './components/Share/SharePage.vue';
import TrendPage from './components/Trend/TrendPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: EntryFeed},
  {path: '/supporter', name: 'Supporter', component: SupporterPage},
  {path: '/supporting', name: 'Supporting', component: SupportingPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/flagged', name: 'Flagged Entries', component: FlaggedPage},
  {path: '/entry', name: 'Entry', component: EntryPage},
  {path: '/share/:shareId', name: 'Share', component: SharePage},
  {path: '/entries', name: 'SupportingEntriesFeed', component: SupportingEntriesFeed},
  {path: '/trends', name: 'TrendPage', component: TrendPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeResolve((to, from, next) => {
  const username = localStorage.getItem('username');
  if (router.app.$store || username) {
    if (to.name === 'Login' && (username || router.app.$store && router.app.$store.state.username)) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if ((to.name !== 'Login' && from.name !== 'Share' && to.name !== 'Share') && (router.app.$store && !router.app.$store.state.username)){
      next({name: 'Login'});
      return;
    }
    
    if(to.name == 'Entry' && (router.app.$store && !router.app.$store.state.entryStatus)){
      next({name: 'Home'});
      return;
    }
  }
  else if (!username && to.name !== 'Login' && to.name !== 'Share' && from.name !== 'Share') {
    next({name: 'Login'});
    return;
  }

  next();
});

export default router;
