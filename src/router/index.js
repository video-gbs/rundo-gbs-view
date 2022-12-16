import Vue from "vue";
import Router from "vue-router";
import staticRouters from "./static/index";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
const all = [0, 1, 2, 3, 4];
const admin = [0, 1];
const superAdmin = [0];
const none = [];

const constantRoutes = [
  {
    path: "/login",
    meta: { title: "登录" },
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  // 用于导航标签刷新页面
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    redirect: "/workTable",
    children: [
      {
        path: "/workTable",
        name: "综合工作台",
        component: () => import("@/views/leftMenus/workTable/index"),
        meta: { title: "综合工作台", icon: "zhgzt" },
      },
    ],
  },
  {
    path: "/politicalInquiryManagement",
    name: "问政管理",
    // meta: { title: '问政管理' },
    component: Layout,
    redirect: "/politicalList",
    // component: () => import('@/views/leftMenus/politicalInquiryManagement/index'),
    meta: { title: "问政管理", icon: "wzgl" },

    children: [
      {
        path: "/politicalList",
        name: "politicalList",
        component: () =>
          import(
            "@/views/leftMenus/politicalInquiryManagement/politicalList/index"
          ),
        meta: { title: "问政列表", icon: "" },
      },
      {
        path: "/politicalList/:type/:id",
        name: "politicalListDetail",
        component: () =>
          import(
            "@/views/leftMenus/politicalInquiryManagement/politicalList/politicalDetail/index"
          ),
        meta: { title: "问政详情", icon: "" },
        hidden: true,
      },
      {
        path: "/politicalAudit",
        name: "politicalAuditList",
        component: () =>
          import(
            "@/views/leftMenus/politicalInquiryManagement/politicalAudit/index"
          ),
        meta: { title: "问政转移审核", icon: "" },
        author: admin,
      },
      // {
      //   path: '/politicalAudit/:id',
      //   name: '问政转移详情',
      //   component: () =>
      //     import(
      //       '@/views/leftMenus/politicalInquiryManagement/politicalAudit/politicalAuditDetail/index'
      //     ),
      //   meta: { title: '问政转移审核', icon: '' },
      //   hidden: true
      // },
      {
        path: "/politicalReply",
        name: "politicalReplyList",
        component: () =>
          import(
            "@/views/leftMenus/politicalInquiryManagement/politicalReply/index"
          ),
        meta: { title: "邀请回复审核", icon: "" },
        // hidden: true,
        author: admin,
      },
      {
        path: "/recycleBin",
        name: "recycleBin",
        component: () =>
          import(
            "@/views/leftMenus/politicalInquiryManagement/recycleBin/index"
          ),
        author: superAdmin,
        meta: { title: "回收站", icon: "" },
      },
      {
        path: "/recycleBin/:id",
        name: "recycleBinDetail",
        component: () =>
          import(
            "@/views/leftMenus/politicalInquiryManagement/recycleBin/politicalDetail/index"
          ),
        author: superAdmin,
        hidden: true,
        meta: { title: "问政详细", icon: "" },
      },
    ],
  },
  {
    path: "/informationManagement",
    name: "informationManagement",
    component: Layout,
    // meta: { title: '展示信息管理' },
    redirect: "/roundChart",
    meta: { title: "展示信息管理", icon: "zsxxgl" },
    author: superAdmin,
    children: [
      {
        path: "/roundChart",
        name: "roundChart",
        author: superAdmin,
        component: () =>
          import("@/views/leftMenus/informationManagement/roundChart/index"),
        meta: { title: "轮播图管理", icon: "" },
      },
      {
        path: "/roundChart/:id",
        name: "roundChartDetail",
        author: superAdmin,
        component: () =>
          import(
            "@/views/leftMenus/informationManagement/roundChart/addOrEdit.vue"
          ),
        hidden: true,
        meta: { title: "轮播图明细", icon: "" },
      },
      {
        path: "/publicManagement",
        name: "publicManagement",
        author: superAdmin,
        component: () =>
          import(
            "@/views/leftMenus/informationManagement/publicManagement/index"
          ),
        meta: { title: "公告管理", icon: "" },
      },
      {
        path: "/publicManagement/:id",
        name: "publicManagementDetail",
        author: superAdmin,
        component: () =>
          import(
            "@/views/leftMenus/informationManagement/publicManagement/addOrEdit"
          ),
        hidden: true,
        meta: { title: "公告详细", icon: "" },
      },
      {
        path: "/advertisementPicture",
        name: "advertisementPicture",
        author: superAdmin,
        component: () =>
          import(
            "@/views/leftMenus/informationManagement/advertisementPicture/index"
          ),
        meta: { title: "广告图管理", icon: "" },
      },
      {
        path: "/advertisementPicture/:id",
        name: "advertisementPictureDetail",
        component: () =>
          import(
            "@/views/leftMenus/informationManagement/advertisementPicture/addOrEdit"
          ),
        author: superAdmin,
        hidden: true,
        meta: { title: "广告图明细", icon: "" },
      },
      {
        path: "/introduction",
        name: "introduction",
        component: () =>
          import("@/views/leftMenus/informationManagement/introduction/index"),
        author: superAdmin,
        meta: { title: "问政简介", icon: "" },
      },
      {
        path: "/askProcess",
        name: "askProcess",
        component: () =>
          import("@/views/leftMenus/informationManagement/askProcess/index"),
        author: superAdmin,
        meta: { title: "提问流程", icon: "" },
      },
      {
        path: "/regulations",
        name: "regulations",
        component: () =>
          import("@/views/leftMenus/informationManagement/regulations/index"),
        author: superAdmin,
        meta: { title: "相关规定", icon: "" },
      },
      {
        path: "/pointsForAttention",
        name: "pointsForAttention",
        component: () =>
          import(
            "@/views/leftMenus/informationManagement/pointsForAttention/index"
          ),
        author: superAdmin,
        meta: { title: "注意事项", icon: "" },
      },
      {
        path: "/contactUs",
        name: "contactUs",
        component: () =>
          import("@/views/leftMenus/informationManagement/contactUs/index"),
        author: superAdmin,
        meta: { title: "联系我们", icon: "" },
      },
    ],
  },
  {
    path: "/userManagement",
    name: "userManagement",
    component: Layout,
    // meta: { title: '用户管理' },
    redirect: "/userManagementIndex",
    // component: () => import('@/views/leftMenus/userManagement/index'),
    meta: { title: "用户管理", icon: "yhgl" },
    author: superAdmin,
    children: [
      {
        path: "/userManagementIndex",
        name: "userManagementIndex",
        author: superAdmin,
        component: () => import("@/views/leftMenus/userManagement/index"),
        meta: { title: "用户管理", icon: "yhgl" },
      },
    ],
  },
  {
    path: "/systemManagement",
    name: "systemManagement",
    // meta: { title: '系统管理' },
    component: Layout,
    redirect: "/accountManagement",
    meta: { title: "系统管理", icon: "sys" },
    author: superAdmin,
    children: [
      {
        path: "/accountManagement",
        name: "accountManagement",
        author: superAdmin,
        component: () =>
          import("@/views/leftMenus/systemManagement/accountManagement/index"),
        meta: { title: "账号管理", icon: "" },
      },
      {
        path: "/roleManagement",
        name: "roleManagement",
        author: none,
        component: () =>
          import("@/views/leftMenus/systemManagement/roleManagement/index"),
        meta: { title: "角色管理", icon: "" },
      },
      {
        path: "/unitManagement",
        name: "unitManagement",
        author: superAdmin,
        component: () =>
          import("@/views/leftMenus/systemManagement/unitManagement/index"),
        meta: { title: "单位管理", icon: "" },
      },
      {
        path: "/otherUnitManagement",
        name: "OtherUnitManagement",
        author: superAdmin,
        hidden: true,
        component: () =>
          import(
            "@/views/leftMenus/systemManagement/otherUnitManagement/index"
          ),
        meta: { title: "单位账号管理", icon: "" },
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const pageAuthor = {};

function setPageAuthor(v) {
  v.forEach((i) => {
    if (i.author !== null && i.author !== undefined) {
      pageAuthor[i.name] = i.author;
    }
    if (i.children) {
      setPageAuthor(i.children);
    }
  });
}
setPageAuthor(constantRoutes);
console.log("pageAuthorpageAuthor", pageAuthor);
export { constantRoutes, pageAuthor };

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
