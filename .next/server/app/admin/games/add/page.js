(()=>{var e={};e.id=373,e.ids=[373],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},25528:e=>{"use strict";e.exports=require("next/dist\\client\\components\\action-async-storage.external.js")},91877:e=>{"use strict";e.exports=require("next/dist\\client\\components\\request-async-storage.external.js")},25319:e=>{"use strict";e.exports=require("next/dist\\client\\components\\static-generation-async-storage.external.js")},45671:(e,t,a)=>{"use strict";a.r(t),a.d(t,{GlobalError:()=>n.a,__next_app__:()=>u,originalPathname:()=>m,pages:()=>c,routeModule:()=>p,tree:()=>o});var s=a(50482),r=a(69108),i=a(62563),n=a.n(i),l=a(68300),d={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>l[e]);a.d(t,d);let o=["",{children:["admin",{children:["games",{children:["add",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,37047)),"C:\\Users\\ibrya\\PycharmProjects\\pythonProject\\.venv\\Scripts\\codes\\Python_Projects_github\\Ads_v2\\Ads\\src\\app\\admin\\games\\add\\page.tsx"]}]},{}]},{}]},{}]},{layout:[()=>Promise.resolve().then(a.bind(a,26826)),"C:\\Users\\ibrya\\PycharmProjects\\pythonProject\\.venv\\Scripts\\codes\\Python_Projects_github\\Ads_v2\\Ads\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,69361,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\ibrya\\PycharmProjects\\pythonProject\\.venv\\Scripts\\codes\\Python_Projects_github\\Ads_v2\\Ads\\src\\app\\admin\\games\\add\\page.tsx"],m="/admin/games/add/page",u={require:a,loadChunk:()=>Promise.resolve()},p=new s.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/admin/games/add/page",pathname:"/admin/games/add",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:o}})},67684:(e,t,a)=>{Promise.resolve().then(a.bind(a,84280))},63024:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(69224).Z)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},84280:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>j});var s=a(95344),r=a(3729),i=a(22254),n=a(95368),l=a(1916),d=a(63806),o=a(13915),c=a(5094),m=a(46540),u=a(11453);let p=r.forwardRef(({className:e,...t},a)=>s.jsx("textarea",{className:(0,u.cn)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:a,...t}));p.displayName="Textarea";var g=a(38157),f=a(13611),h=a(7361),x=a(34755),y=a(63024),b=a(20783),v=a.n(b);function j(){let e=(0,i.useRouter)(),[t,a]=(0,r.useState)({title:"",description:"",instructions:"",category:"",developer:"",thumbnail:"",gameUrl:"",featured:!1}),[u,b]=(0,r.useState)(null),[j,w]=(0,r.useState)(null),{data:N}=(0,n.aM)(o.H1),[P,{loading:$}]=(0,l.D)(d.m0,{onCompleted:()=>{x.Am.success("Oyun başarıyla eklendi"),e.push("/admin/games")},onError:e=>{x.Am.error(`Hata: ${e.message}`)}}),_=e=>{let{name:t,value:s}=e.target;a(e=>({...e,[t]:s}))},G=(e,t)=>{a(a=>({...a,[e]:t}))},C=(e,t)=>{a(a=>({...a,[e]:t}))},k=async e=>{if(e.preventDefault(),!t.title||!t.category||!t.gameUrl){x.Am.error("L\xfctfen gerekli alanları doldurun");return}let a=t.thumbnail;u&&(a=j),P({variables:{input:{...t,thumbnail:a}}})};return(0,s.jsxs)("div",{className:"p-8",children:[(0,s.jsxs)("div",{className:"flex items-center gap-4 mb-6",children:[s.jsx(v(),{href:"/admin/games",children:(0,s.jsxs)(c.z,{variant:"outline",size:"sm",children:[s.jsx(y.Z,{className:"mr-2 h-4 w-4"}),"Geri"]})}),s.jsx("h1",{className:"text-3xl font-bold",children:"Yeni Oyun Ekle"})]}),(0,s.jsxs)("form",{onSubmit:k,className:"space-y-6 max-w-3xl",children:[(0,s.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[(0,s.jsxs)("div",{className:"space-y-2",children:[s.jsx(h._,{htmlFor:"title",children:"Oyun Adı *"}),s.jsx(m.I,{id:"title",name:"title",value:t.title,onChange:_,placeholder:"Oyun adını girin",required:!0})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[s.jsx(h._,{htmlFor:"category",children:"Kategori *"}),(0,s.jsxs)(g.Ph,{value:t.category,onValueChange:e=>G("category",e),children:[s.jsx(g.i4,{children:s.jsx(g.ki,{placeholder:"Kategori se\xe7in"})}),s.jsx(g.Bw,{children:N?.gameCategories?.map(e=>s.jsx(g.Ql,{value:e,children:e},e))})]})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[s.jsx(h._,{htmlFor:"developer",children:"Geliştirici"}),s.jsx(m.I,{id:"developer",name:"developer",value:t.developer,onChange:_,placeholder:"Geliştirici adını girin"})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[s.jsx(h._,{htmlFor:"gameUrl",children:"Oyun URL *"}),s.jsx(m.I,{id:"gameUrl",name:"gameUrl",value:t.gameUrl,onChange:_,placeholder:"Oyun URL'sini girin",required:!0})]})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[s.jsx(h._,{htmlFor:"description",children:"A\xe7ıklama"}),s.jsx(p,{id:"description",name:"description",value:t.description,onChange:_,placeholder:"Oyun a\xe7ıklamasını girin",rows:3})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[s.jsx(h._,{htmlFor:"instructions",children:"Oyun Talimatları"}),s.jsx(p,{id:"instructions",name:"instructions",value:t.instructions,onChange:_,placeholder:"Oyun talimatlarını girin",rows:3})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[s.jsx(h._,{htmlFor:"thumbnail",children:"G\xf6rsel URL"}),s.jsx(m.I,{id:"thumbnail",name:"thumbnail",value:t.thumbnail,onChange:_,placeholder:"G\xf6rsel URL'sini girin"})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[s.jsx(h._,{htmlFor:"thumbnailFile",children:"Veya G\xf6rsel Y\xfckle"}),s.jsx(m.I,{id:"thumbnailFile",type:"file",accept:"image/*",onChange:e=>{let t=e.target.files?.[0];if(t){b(t);let e=new FileReader;e.onloadend=()=>{w(e.result)},e.readAsDataURL(t)}}}),j&&(0,s.jsxs)("div",{className:"mt-2",children:[s.jsx("p",{className:"text-sm text-muted-foreground mb-2",children:"\xd6nizleme:"}),s.jsx("div",{className:"w-40 h-40 relative rounded overflow-hidden border",children:s.jsx("img",{src:j,alt:"Thumbnail preview",className:"object-cover w-full h-full"})})]})]}),(0,s.jsxs)("div",{className:"flex items-center space-x-2",children:[s.jsx(f.r,{id:"featured",checked:t.featured,onCheckedChange:e=>C("featured",e)}),s.jsx(h._,{htmlFor:"featured",children:"\xd6ne \xc7ıkan Oyun"})]}),(0,s.jsxs)("div",{className:"flex justify-end gap-4",children:[s.jsx(c.z,{type:"button",variant:"outline",onClick:()=>e.push("/admin/games"),children:"İptal"}),s.jsx(c.z,{type:"submit",disabled:$,children:$?"Kaydediliyor...":"Oyunu Kaydet"})]})]})]})}},46540:(e,t,a)=>{"use strict";a.d(t,{I:()=>n});var s=a(95344),r=a(3729),i=a(11453);let n=r.forwardRef(({className:e,type:t,...a},r)=>s.jsx("input",{type:t,className:(0,i.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:r,...a}));n.displayName="Input"},7361:(e,t,a)=>{"use strict";a.d(t,{_:()=>o});var s=a(95344),r=a(3729),i=a(14217),n=a(49247),l=a(11453);let d=(0,n.j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),o=r.forwardRef(({className:e,...t},a)=>s.jsx(i.f,{ref:a,className:(0,l.cn)(d(),e),...t}));o.displayName=i.f.displayName},38157:(e,t,a)=>{"use strict";a.d(t,{Bw:()=>f,Ph:()=>c,Ql:()=>h,i4:()=>u,ki:()=>m});var s=a(95344),r=a(3729),i=a(43224),n=a(25390),l=a(12704),d=a(62312),o=a(11453);let c=i.fC;i.ZA;let m=i.B4,u=r.forwardRef(({className:e,children:t,...a},r)=>(0,s.jsxs)(i.xz,{ref:r,className:(0,o.cn)("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",e),...a,children:[t,s.jsx(i.JO,{asChild:!0,children:s.jsx(n.Z,{className:"h-4 w-4 opacity-50"})})]}));u.displayName=i.xz.displayName;let p=r.forwardRef(({className:e,...t},a)=>s.jsx(i.u_,{ref:a,className:(0,o.cn)("flex cursor-default items-center justify-center py-1",e),...t,children:s.jsx(l.Z,{className:"h-4 w-4"})}));p.displayName=i.u_.displayName;let g=r.forwardRef(({className:e,...t},a)=>s.jsx(i.$G,{ref:a,className:(0,o.cn)("flex cursor-default items-center justify-center py-1",e),...t,children:s.jsx(n.Z,{className:"h-4 w-4"})}));g.displayName=i.$G.displayName;let f=r.forwardRef(({className:e,children:t,position:a="popper",...r},n)=>s.jsx(i.h_,{children:(0,s.jsxs)(i.VY,{ref:n,className:(0,o.cn)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2","popper"===a&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",e),position:a,...r,children:[s.jsx(p,{}),s.jsx(i.l_,{className:(0,o.cn)("p-1","popper"===a&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:t}),s.jsx(g,{})]})}));f.displayName=i.VY.displayName,r.forwardRef(({className:e,...t},a)=>s.jsx(i.__,{ref:a,className:(0,o.cn)("py-1.5 pl-8 pr-2 text-sm font-semibold",e),...t})).displayName=i.__.displayName;let h=r.forwardRef(({className:e,children:t,...a},r)=>(0,s.jsxs)(i.ck,{ref:r,className:(0,o.cn)("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",e),...a,children:[s.jsx("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:s.jsx(i.wU,{children:s.jsx(d.Z,{className:"h-4 w-4"})})}),s.jsx(i.eT,{children:t})]}));h.displayName=i.ck.displayName,r.forwardRef(({className:e,...t},a)=>s.jsx(i.Z0,{ref:a,className:(0,o.cn)("-mx-1 my-1 h-px bg-muted",e),...t})).displayName=i.Z0.displayName},13611:(e,t,a)=>{"use strict";a.d(t,{r:()=>l});var s=a(95344),r=a(3729),i=a(19655),n=a(11453);let l=r.forwardRef(({className:e,...t},a)=>s.jsx(i.fC,{className:(0,n.cn)("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",e),...t,ref:a,children:s.jsx(i.bU,{className:(0,n.cn)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")})}));l.displayName=i.fC.displayName},63806:(e,t,a)=>{"use strict";a.d(t,{Kc:()=>l,QJ:()=>n,m0:()=>i,ym:()=>r});var s=a(59361);let r=s.Ps`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;s.Ps`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;let i=s.Ps`
  mutation AddGame($input: GameInput!) {
    addGame(input: $input) {
      id
      title
      description
      category
      developer
      thumbnail
      gameUrl
      featured
      createdAt
    }
  }
`;s.Ps`
  mutation UpdateGame($id: ID!, $input: GameInput!) {
    updateGame(id: $id, input: $input) {
      id
      title
      description
      category
      developer
      thumbnail
      gameUrl
      featured
      createdAt
    }
  }
`;let n=s.Ps`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id)
  }
`,l=s.Ps`
  mutation UpdateGameFeatured($id: ID!, $featured: Boolean!) {
    updateGame(id: $id, input: { featured: $featured }) {
      id
      featured
    }
  }
`;s.Ps`
  mutation IncrementPlayCount($gameId: ID!) {
    incrementPlayCount(gameId: $gameId) {
      id
      playCount
    }
  }
`,s.Ps`
  mutation AddToFavorites($gameId: ID!) {
    addToFavorites(gameId: $gameId)
  }
`,s.Ps`
  mutation RemoveFromFavorites($gameId: ID!) {
    removeFromFavorites(gameId: $gameId)
  }
`},13915:(e,t,a)=>{"use strict";a.d(t,{H1:()=>n,Ou:()=>i,ZM:()=>l,si:()=>r});var s=a(59361);let r=s.Ps`
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
`;s.Ps`
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
`,s.Ps`
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
`,s.Ps`
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
`;let i=s.Ps`
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
`,n=s.Ps`
  query GetGameCategories {
    gameCategories
  }
`,l=s.Ps`
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
`},37047:(e,t,a)=>{"use strict";a.r(t),a.d(t,{$$typeof:()=>i,__esModule:()=>r,default:()=>n});let s=(0,a(86843).createProxy)(String.raw`C:\Users\ibrya\PycharmProjects\pythonProject\.venv\Scripts\codes\Python_Projects_github\Ads_v2\Ads\src\app\admin\games\add\page.tsx`),{__esModule:r,$$typeof:i}=s,n=s.default},14217:(e,t,a)=>{"use strict";a.d(t,{f:()=>l});var s=a(3729),r=a(62409),i=a(95344),n=s.forwardRef((e,t)=>(0,i.jsx)(r.WV.label,{...e,ref:t,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));n.displayName="Label";var l=n}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[638,20,492,376,368,323,808,167],()=>a(45671));module.exports=s})();