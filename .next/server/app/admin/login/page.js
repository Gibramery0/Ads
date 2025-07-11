(()=>{var e={};e.id=920,e.ids=[920],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},25528:e=>{"use strict";e.exports=require("next/dist\\client\\components\\action-async-storage.external.js")},91877:e=>{"use strict";e.exports=require("next/dist\\client\\components\\request-async-storage.external.js")},25319:e=>{"use strict";e.exports=require("next/dist\\client\\components\\static-generation-async-storage.external.js")},89198:(e,r,t)=>{"use strict";t.r(r),t.d(r,{GlobalError:()=>s.a,__next_app__:()=>m,originalPathname:()=>c,pages:()=>u,routeModule:()=>p,tree:()=>l});var a=t(50482),i=t(69108),n=t(62563),s=t.n(n),o=t(68300),d={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>o[e]);t.d(r,d);let l=["",{children:["admin",{children:["login",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,3386)),"C:\\Users\\ibrya\\PycharmProjects\\pythonProject\\.venv\\Scripts\\codes\\Python_Projects_github\\Ads_v2\\Ads\\src\\app\\admin\\login\\page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,26826)),"C:\\Users\\ibrya\\PycharmProjects\\pythonProject\\.venv\\Scripts\\codes\\Python_Projects_github\\Ads_v2\\Ads\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,69361,23)),"next/dist/client/components/not-found-error"]}],u=["C:\\Users\\ibrya\\PycharmProjects\\pythonProject\\.venv\\Scripts\\codes\\Python_Projects_github\\Ads_v2\\Ads\\src\\app\\admin\\login\\page.tsx"],c="/admin/login/page",m={require:t,loadChunk:()=>Promise.resolve()},p=new a.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/admin/login/page",pathname:"/admin/login",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},74977:(e,r,t)=>{Promise.resolve().then(t.bind(t,38904))},38904:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>p});var a=t(95344),i=t(3729),n=t(22254),s=t(1916),o=t(63806),d=t(23673),l=t(5094),u=t(46540),c=t(7361),m=t(34755);function p(){let e=(0,n.useRouter)(),[r,t]=(0,i.useState)(""),[p,f]=(0,i.useState)(""),[g,v]=(0,i.useState)(""),[x,{loading:h}]=(0,s.D)(o.ym,{onCompleted:r=>{r?.login?(localStorage.setItem("token",r.login),m.Am.success("Giriş başarılı!"),e.push("/admin")):(v("Giriş başarısız: Ge\xe7ersiz yanıt"),m.Am.error("Giriş başarısız: Ge\xe7ersiz yanıt"))},onError:e=>{console.error("Login error:",e),v(`Giriş başarısız: ${e.message}`),m.Am.error(`Giriş başarısız: ${e.message}`)}});return a.jsx("div",{className:"flex items-center justify-center min-h-screen bg-background",children:(0,a.jsxs)(d.Zb,{className:"w-full max-w-md",children:[(0,a.jsxs)(d.Ol,{children:[a.jsx(d.ll,{className:"text-2xl font-bold font-orbitron",children:"Admin Girişi"}),a.jsx(d.SZ,{children:"Y\xf6netim paneline erişmek i\xe7in giriş yapın"})]}),(0,a.jsxs)("form",{onSubmit:e=>{if(e.preventDefault(),v(""),!r||!p){v("E-posta ve şifre gereklidir"),m.Am.error("E-posta ve şifre gereklidir");return}try{x({variables:{email:r,password:p},errorPolicy:"all"})}catch(e){console.error("Login submission error:",e),v("Bir hata oluştu, l\xfctfen tekrar deneyin"),m.Am.error("Bir hata oluştu, l\xfctfen tekrar deneyin")}},children:[(0,a.jsxs)(d.aY,{className:"space-y-4",children:[g&&a.jsx("div",{className:"p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm",children:g}),(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx(c._,{htmlFor:"email",children:"E-posta"}),a.jsx(u.I,{id:"email",type:"email",placeholder:"admin@example.com",value:r,onChange:e=>t(e.target.value),required:!0})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx(c._,{htmlFor:"password",children:"Şifre"}),a.jsx(u.I,{id:"password",type:"password",value:p,onChange:e=>f(e.target.value),required:!0})]})]}),a.jsx(d.eW,{children:a.jsx(l.z,{type:"submit",className:"w-full",disabled:h,children:h?(0,a.jsxs)(a.Fragment,{children:[a.jsx("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"}),"Giriş yapılıyor..."]}):"Giriş Yap"})})]})]})})}},23673:(e,r,t)=>{"use strict";t.d(r,{Ol:()=>o,SZ:()=>l,Zb:()=>s,aY:()=>u,eW:()=>c,ll:()=>d});var a=t(95344),i=t(3729),n=t(11453);let s=i.forwardRef(({className:e,...r},t)=>a.jsx("div",{ref:t,className:(0,n.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...r}));s.displayName="Card";let o=i.forwardRef(({className:e,...r},t)=>a.jsx("div",{ref:t,className:(0,n.cn)("flex flex-col space-y-1.5 p-6",e),...r}));o.displayName="CardHeader";let d=i.forwardRef(({className:e,...r},t)=>a.jsx("h3",{ref:t,className:(0,n.cn)("text-2xl font-semibold leading-none tracking-tight",e),...r}));d.displayName="CardTitle";let l=i.forwardRef(({className:e,...r},t)=>a.jsx("p",{ref:t,className:(0,n.cn)("text-sm text-muted-foreground",e),...r}));l.displayName="CardDescription";let u=i.forwardRef(({className:e,...r},t)=>a.jsx("div",{ref:t,className:(0,n.cn)("p-6 pt-0",e),...r}));u.displayName="CardContent";let c=i.forwardRef(({className:e,...r},t)=>a.jsx("div",{ref:t,className:(0,n.cn)("flex items-center p-6 pt-0",e),...r}));c.displayName="CardFooter"},46540:(e,r,t)=>{"use strict";t.d(r,{I:()=>s});var a=t(95344),i=t(3729),n=t(11453);let s=i.forwardRef(({className:e,type:r,...t},i)=>a.jsx("input",{type:r,className:(0,n.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:i,...t}));s.displayName="Input"},7361:(e,r,t)=>{"use strict";t.d(r,{_:()=>l});var a=t(95344),i=t(3729),n=t(14217),s=t(49247),o=t(11453);let d=(0,s.j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),l=i.forwardRef(({className:e,...r},t)=>a.jsx(n.f,{ref:t,className:(0,o.cn)(d(),e),...r}));l.displayName=n.f.displayName},63806:(e,r,t)=>{"use strict";t.d(r,{Kc:()=>o,QJ:()=>s,m0:()=>n,ym:()=>i});var a=t(59361);let i=a.Ps`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;a.Ps`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;let n=a.Ps`
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
`;a.Ps`
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
`;let s=a.Ps`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id)
  }
`,o=a.Ps`
  mutation UpdateGameFeatured($id: ID!, $featured: Boolean!) {
    updateGame(id: $id, input: { featured: $featured }) {
      id
      featured
    }
  }
`;a.Ps`
  mutation IncrementPlayCount($gameId: ID!) {
    incrementPlayCount(gameId: $gameId) {
      id
      playCount
    }
  }
`,a.Ps`
  mutation AddToFavorites($gameId: ID!) {
    addToFavorites(gameId: $gameId)
  }
`,a.Ps`
  mutation RemoveFromFavorites($gameId: ID!) {
    removeFromFavorites(gameId: $gameId)
  }
`},3386:(e,r,t)=>{"use strict";t.r(r),t.d(r,{$$typeof:()=>n,__esModule:()=>i,default:()=>s});let a=(0,t(86843).createProxy)(String.raw`C:\Users\ibrya\PycharmProjects\pythonProject\.venv\Scripts\codes\Python_Projects_github\Ads_v2\Ads\src\app\admin\login\page.tsx`),{__esModule:i,$$typeof:n}=a,s=a.default},1916:(e,r,t)=>{"use strict";t.d(r,{D:()=>c});var a=t(62824),i=t(71318),n=t(47133),s=t(30502),o=t(55547),d=t(17872),l=t(15142),u=t(80205).Nq?i.useLayoutEffect:i.useEffect;function c(e,r){var t=(0,l.x)(null==r?void 0:r.client);(0,o.Vp)(e,o.n_.Mutation);var c=i.useState({called:!1,loading:!1,client:t}),m=c[0],p=c[1],f=i.useRef({result:m,mutationId:0,isMounted:!0,client:t,mutation:e,options:r});u(function(){Object.assign(f.current,{client:t,options:r,mutation:e})});var g=i.useCallback(function(e){void 0===e&&(e={});var r=f.current,t=r.options,i=r.mutation,o=(0,a.pi)((0,a.pi)({},t),{mutation:i}),l=e.client||f.current.client;f.current.result.loading||o.ignoreResults||!f.current.isMounted||p(f.current.result={loading:!0,error:void 0,data:void 0,called:!0,client:l});var u=++f.current.mutationId,c=(0,n.J)(o,e);return l.mutate(c).then(function(r){var t,a,i=r.data,n=r.errors,o=n&&n.length>0?new d.cA({graphQLErrors:n}):void 0,m=e.onError||(null===(t=f.current.options)||void 0===t?void 0:t.onError);if(o&&m&&m(o,c),u===f.current.mutationId&&!c.ignoreResults){var g={called:!0,loading:!1,data:i,error:o,client:l};f.current.isMounted&&!(0,s.D)(f.current.result,g)&&p(f.current.result=g)}var v=e.onCompleted||(null===(a=f.current.options)||void 0===a?void 0:a.onCompleted);return o||null==v||v(r.data,c),r},function(r){if(u===f.current.mutationId&&f.current.isMounted){var t,a={loading:!1,error:r,data:void 0,called:!0,client:l};(0,s.D)(f.current.result,a)||p(f.current.result=a)}var i=e.onError||(null===(t=f.current.options)||void 0===t?void 0:t.onError);if(i)return i(r,c),{data:void 0,errors:r};throw r})},[]),v=i.useCallback(function(){if(f.current.isMounted){var e={called:!1,loading:!1,client:f.current.client};Object.assign(f.current,{mutationId:0,result:e}),p(e)}},[]);return i.useEffect(function(){var e=f.current;return e.isMounted=!0,function(){e.isMounted=!1}},[]),[g,(0,a.pi)({reset:v},m)]}},14217:(e,r,t)=>{"use strict";t.d(r,{f:()=>o});var a=t(3729),i=t(62409),n=t(95344),s=a.forwardRef((e,r)=>(0,n.jsx)(i.WV.label,{...e,ref:r,onMouseDown:r=>{r.target.closest("button, input, select, textarea")||(e.onMouseDown?.(r),!r.defaultPrevented&&r.detail>1&&r.preventDefault())}}));s.displayName="Label";var o=s}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[638,20,492,376,167],()=>t(89198));module.exports=a})();