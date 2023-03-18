import{s as e,a as n,u as a,b as r,c as i,j as o,F as t,d as s,e as d,H as c,T as h,M as m,S as g}from"./index-5c950735.js";const l={Background:e.div`
    background-color: ${({theme:e})=>e.bg};
    height: 100%;
    transition: background-color 0.5s;

    @media (prefers-reduced-motion) {
      transition: none;
    }
  `,Container:e.div`
    height: 100%;
    margin: 0 auto;
    max-width: 640px;
    padding: 14px ${n.XXXS};
  `};function u(){const e=a((e=>e.currentTimerName)),n=r((e=>e.openedModal)),u=i((e=>e.config.theme));return o(t,{theme:{bg:u.colorThemes[e],text:s.WHITE},children:o(l.Background,{children:d(l.Container,{children:[o(c,{}),d("main",{children:[o(h,{}),"settings"===n?o(m,{children:o(g,{})}):null]})]})})})}export{u as default};
