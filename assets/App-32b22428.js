import{U as n,s as e,z as a,c as i,j as r,V as t,r as o,_ as s,a as d,u as c,b as l,d as h,F as m,e as u,H as g,T as f,M as p}from"./index-ef663e3a.js";const _=n`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`,x={Container:e.div`
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: ${a};

    > div {
      animation: ${_} 1s infinite;
      color: ${i.WHITE};
    }
  `};function b(){return r(x.Container,{children:r("div",{children:r(t,{size:75})})})}const T=o.lazy((()=>s((()=>import("./index-ef663e3a.js").then((n=>n.S))),["assets/index-ef663e3a.js","assets/index-be6ca56e.css"]))),k=o.lazy((()=>s((()=>import("./index-ef663e3a.js").then((n=>n.C))),["assets/index-ef663e3a.js","assets/index-be6ca56e.css"]))),E={Background:e.div`
    background-color: ${({theme:n})=>n.bg};
    height: 100%;
    transition: background-color 0.5s;

    @media (prefers-reduced-motion) {
      transition: none;
    }
  `,Container:e.div`
    height: 100%;
    margin: 0 auto;
    max-width: 640px;
    padding: 14px ${d.XXXS};
  `};function v(){const n=c((n=>n.currentTimerName)),e=l((n=>n.openedModal)),a=h((n=>n.config.theme));return r(m,{theme:{bg:a.colorThemes[n],text:i.WHITE},children:r(E.Background,{children:u(E.Container,{children:[r(g,{}),u("main",{children:[r(f,{}),"settings"===e?r(p,{children:r(o.Suspense,{fallback:r(b,{}),children:r(T,{})})}):null,"colors"===e?r(p,{children:r(o.Suspense,{fallback:r(b,{}),children:r(k,{})})}):null]})]})})})}export{v as default};
