(()=>{var e={};e.id=423,e.ids=[423],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},25528:e=>{"use strict";e.exports=require("next/dist\\client\\components\\action-async-storage.external.js")},91877:e=>{"use strict";e.exports=require("next/dist\\client\\components\\request-async-storage.external.js")},25319:e=>{"use strict";e.exports=require("next/dist\\client\\components\\static-generation-async-storage.external.js")},26919:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>l.a,__next_app__:()=>u,originalPathname:()=>m,pages:()=>c,routeModule:()=>g,tree:()=>d});var r=s(50482),a=s(69108),i=s(62563),l=s.n(i),n=s(68300),o={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>n[e]);s.d(t,o);let d=["",{children:["games",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,14301)),"C:\\Users\\ibrya\\PycharmProjects\\pythonProject\\.venv\\Scripts\\codes\\Python_Projects_github\\Ads_v2\\Ads\\src\\app\\games\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,26826)),"C:\\Users\\ibrya\\PycharmProjects\\pythonProject\\.venv\\Scripts\\codes\\Python_Projects_github\\Ads_v2\\Ads\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,69361,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\ibrya\\PycharmProjects\\pythonProject\\.venv\\Scripts\\codes\\Python_Projects_github\\Ads_v2\\Ads\\src\\app\\games\\page.tsx"],m="/games/page",u={require:s,loadChunk:()=>Promise.resolve()},g=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/games/page",pathname:"/games",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},41287:(e,t,s)=>{Promise.resolve().then(s.bind(s,41660))},41660:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>m});var r=s(95344),a=s(3729),i=s(95368),l=s(13915),n=s(58016),o=s(5094),d=s(46540),c=s(28765);function m(){let[e,t]=(0,a.useState)(""),[s,m]=(0,a.useState)(50),{data:u,loading:g,error:p,fetchMore:x}=(0,i.aM)(l.si,{variables:{limit:s},notifyOnNetworkStatusChange:!0}),h=u?.games?.filter(t=>t.title.toLowerCase().includes(e.toLowerCase())||t.category.toLowerCase().includes(e.toLowerCase())||t.developer?.toLowerCase().includes(e.toLowerCase()))||[];return p?r.jsx("div",{className:"container mx-auto px-4 py-8",children:(0,r.jsxs)("div",{className:"text-center",children:[r.jsx("h1",{className:"text-2xl font-bold mb-4",children:"Hata Oluştu"}),r.jsx("p",{className:"text-muted-foreground",children:p.message})]})}):(0,r.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,r.jsxs)("div",{className:"mb-8",children:[r.jsx("h1",{className:"text-4xl font-bold mb-4",children:"T\xfcm Oyunlar"}),(0,r.jsxs)("p",{className:"text-muted-foreground mb-6",children:[u?.games?.length||0," oyun bulundu (Toplam 5400+ oyun)"]}),(0,r.jsxs)("div",{className:"relative max-w-md",children:[r.jsx(c.Z,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"}),r.jsx(d.I,{placeholder:"Oyun ara...",value:e,onChange:e=>t(e.target.value),className:"pl-10"})]})]}),g&&50===s&&r.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4",children:Array.from({length:24}).map((e,t)=>(0,r.jsxs)("div",{className:"animate-pulse",children:[r.jsx("div",{className:"bg-gray-300 aspect-video rounded-lg mb-2"}),r.jsx("div",{className:"bg-gray-300 h-4 rounded mb-1"}),r.jsx("div",{className:"bg-gray-300 h-3 rounded w-2/3"})]},t))}),!g||s>50?(0,r.jsxs)(r.Fragment,{children:[r.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8",children:h.map(e=>r.jsx(n.y,{id:e.id,title:e.title,imageUrl:e.thumbnail,category:[e.category],aspectRatio:"video"},e.id))}),u?.games&&u.games.length>=s&&(0,r.jsxs)("div",{className:"text-center",children:[r.jsx(o.z,{onClick:()=>{m(e=>e+50)},disabled:g,size:"lg",children:g?"Y\xfckleniyor...":"Daha Fazla Oyun Y\xfckle"}),(0,r.jsxs)("p",{className:"text-sm text-muted-foreground mt-2",children:[u.games.length," / 5400+ oyun g\xf6steriliyor"]})]}),e&&0===h.length&&(0,r.jsxs)("div",{className:"text-center py-12",children:[r.jsx("h3",{className:"text-xl font-semibold mb-2",children:"Oyun Bulunamadı"}),(0,r.jsxs)("p",{className:"text-muted-foreground",children:['"',e,'" i\xe7in sonu\xe7 bulunamadı. Farklı bir arama terimi deneyin.']})]})]}):null,(0,r.jsxs)("div",{className:"mt-12 grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,r.jsxs)("div",{className:"bg-card p-6 rounded-lg border text-center",children:[r.jsx("h3",{className:"text-2xl font-bold text-primary",children:u?.games?.length||0}),r.jsx("p",{className:"text-muted-foreground",children:"Y\xfcklenen Oyun"})]}),(0,r.jsxs)("div",{className:"bg-card p-6 rounded-lg border text-center",children:[r.jsx("h3",{className:"text-2xl font-bold text-primary",children:"5400+"}),r.jsx("p",{className:"text-muted-foreground",children:"Toplam Oyun"})]}),(0,r.jsxs)("div",{className:"bg-card p-6 rounded-lg border text-center",children:[r.jsx("h3",{className:"text-2xl font-bold text-primary",children:h.length}),r.jsx("p",{className:"text-muted-foreground",children:"Filtrelenmiş Sonu\xe7"})]})]})]})}},58016:(e,t,s)=>{"use strict";s.d(t,{y:()=>c});var r=s(95344),a=s(20783),i=s.n(a),l=s(41223),n=s.n(l),o=s(11453),d=s(3729);function c({id:e,title:t,imageUrl:s,category:a,className:l,aspectRatio:c="square",width:m,height:u}){let[g,p]=(0,d.useState)(!1);return r.jsx("div",{className:(0,o.cn)("relative overflow-hidden rounded-sm",l),children:r.jsx(i(),{href:`/game/${e}`,className:"block h-full w-full hover-card",children:(0,r.jsxs)("div",{className:"relative",children:[r.jsx("div",{className:(0,o.cn)("overflow-hidden rounded-sm",{"aspect-square":"square"===c,"aspect-[3/4]":"portrait"===c,"aspect-video":"video"===c}),children:r.jsx(n(),{src:g?"https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop&auto=format&q=80":s,alt:t,width:m||300,height:u||300,className:"object-cover",onError:()=>p(!0),unoptimized:!0})}),r.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1",children:r.jsx("div",{children:r.jsx("h3",{className:"font-medium text-white line-clamp-2 text-xs",children:t})})})]})})})}},46540:(e,t,s)=>{"use strict";s.d(t,{I:()=>l});var r=s(95344),a=s(3729),i=s(11453);let l=a.forwardRef(({className:e,type:t,...s},a)=>r.jsx("input",{type:t,className:(0,i.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:a,...s}));l.displayName="Input"},13915:(e,t,s)=>{"use strict";s.d(t,{H1:()=>l,Ou:()=>i,ZM:()=>n,si:()=>a});var r=s(59361);let a=r.Ps`
  query GetGames($limit: Int, $offset: Int) {
    games(limit: $limit, offset: $offset) {
      id
      title
      description
      category
      thumbnail
      gameUrl
      featured
      playCount
      createdAt
    }
  }
`;r.Ps`
  query GetFeaturedGames($limit: Int) {
    featuredGames(limit: $limit) {
      id
      title
      description
      category
      thumbnail
      gameUrl
      playCount
      createdAt
    }
  }
`,r.Ps`
  query GetPopularGames($limit: Int) {
    popularGames(limit: $limit) {
      id
      title
      description
      category
      thumbnail
      gameUrl
      playCount
      createdAt
    }
  }
`,r.Ps`
  query GetGame($id: ID!) {
    game(id: $id) {
      id
      title
      description
      category
      tags
      url
      thumbnail
      featured
      playCount
      developer
      width
      height
    }
  }
`;let i=r.Ps`
  query GetAdminGames($page: Int, $limit: Int, $search: String, $category: String) {
    adminGames(page: $page, limit: $limit, search: $search, category: $category) {
      games {
        id
        title
        description
        category
        developer
        thumbnail
        gameUrl
        featured
        playCount
        createdAt
      }
      totalCount
      pageCount
    }
  }
`,l=r.Ps`
  query GetGameCategories {
    gameCategories
  }
`,n=r.Ps`
  query GetGamesStats {
    gamesStats {
      totalGames
      totalPlays
      totalUsers
      featuredGames
      popularCategories {
        name
        count
      }
    }
  }
`},14301:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>i,__esModule:()=>a,default:()=>l});let r=(0,s(86843).createProxy)(String.raw`C:\Users\ibrya\PycharmProjects\pythonProject\.venv\Scripts\codes\Python_Projects_github\Ads_v2\Ads\src\app\games\page.tsx`),{__esModule:a,$$typeof:i}=r,l=r.default}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[638,20,376,368,167],()=>s(26919));module.exports=r})();