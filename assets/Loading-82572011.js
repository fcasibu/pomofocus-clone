import{e as i,j as n,f as e,U as t,s as a,d as o,a as s}from"./index-5c950735.js";const r=t`
  0% {
    opacity: 0.85;
  }
  100% {
    opacity: 1;
  }
`,c={Container:a.div`
    align-items: center;
    background-color: ${o.RED};
    color: ${o.WHITE};
    display: flex;
    flex-direction: column;
    gap: ${s.XXS};
    height: 100%;
    justify-content: center;
    width: 100%;

    > h1 {
      animation: ${r} 0.5s ease-in-out infinite;
      font-size: 18px;
      font-weight: 700;
    }
  `};function d(){return i(c.Container,{children:[n(e,{size:70}),n("h1",{children:"Loading..."})]})}export{d as default};
