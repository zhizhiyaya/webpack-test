import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use( VueRouter );

const TodoInfo = {template: '<div>Foo</div>'}
// import Foo from './components/Foo.vue';
// const Foo = () => import('./components/Foo.vue');
const Foo = () => import(/* webpackChunkName: "group-foo" */ './components/Foo.vue');

const routes = [
    { path: '/todo', component: TodoInfo },
    { path: '/foo', component: Foo },
]; 
const router = new VueRouter({
    routes
});
console.log(router);
export default router;
