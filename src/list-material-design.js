export default `

gumga-list .table{
  margin: 0;
}

gumga-list tr{
  transition: background-color .2s;
  height: 48px !important;
  font-family: Roboto,"Helvetica Neue",sans-serif;
}

gumga-list tr th a:hover{
  color: #525252;
  text-decoration: none;
  cursor: pointer;
}

gumga-list .table>thead>tr>th{
  border: none !important;
  vertical-align: initial !important;
}

/**
  START PERSONALIZE ROWS
**/

gumga-list tbody tr:hover{
  background: #f5f5f5 !important;
}

gumga-list .active-list .smart-grid-fixed {
  background: #f5f5f5 !important;
}

/**
  END PERSONALIZE ROWS
**/

.effect-ripple {
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}
.effect-ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .5s, opacity 1s;
}
.effect-ripple:active:after {
  transform: scale(0, 0);
  opacity: .2;
  transition: 0s;
}

gumga-list .panel .panel-body{
  margin: 0 !important;
}

gumga-list .smart-footer-item button{
  border: none !important;
  outline: none !important;
  background: #fff;
  color: #636262;
}

gumga-list .smart-footer-item > button:hover, gumga-list .smart-footer-item > button:active{
  background: #fff;
  outline: none !important;
  color: #000000;
}

gumga-list .btn-default.active.focus, .btn-default.active:focus, .btn-default.active:hover, .btn-default:active.focus, .btn-default:active:focus, .btn-default:active:hover, .open>.dropdown-toggle.btn-default.focus, .open>.dropdown-toggle.btn-default:focus, .open>.dropdown-toggle.btn-default:hover{
  box-shadow: none;
  background: #fff;
}

gumga-list .smart-footer-item ul{
  margin-top: -32px;
  min-width: 136px;
  min-height: 48px;
  max-height: 256px;
  overflow-y: auto;
  padding: 0;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)!important;
  transition: all .4s cubic-bezier(.25,.8,.25,1)!important;
  border-radius: 2px!important;
  border: none!important;
}

gumga-list .smart-footer-item ul li{
  cursor: pointer;
  padding: 16px 16px;
  font-size: 12px;
  color: rgba(0,0,0,0.87);
  background: #F5F5F5;
  align-items: center;
  height: 48px;
}

gumga-list .smart-footer-item ul li.selected{
  color: rgb(33,150,243);
}

gumga-list .panel .panel-footer{
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  -webkit-flex-wrap: wrap-reverse;
  -ms-flex-wrap: wrap-reverse;
  flex-wrap: wrap-reverse;
  box-sizing: border-box;
  padding: 0px 24px;
  font-size: 12px;
  color: rgba(0,0,0,.54);
  border-top: 1px rgba(0,0,0,.12) solid !important;
}

gumga-list .panel .panel-footer .page-select{
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  height: 56px;
}

gumga-list td[class*="td-checkbox"], gumga-list th, gumga-list td[class*="ng-binding"]{
  font-family: Roboto,"Helvetica Neue",sans-serif;
  padding: 17px 0px 0px 24px !important;
  color: rgba(0,0,0,.87) !important;
  font-size: 13px !important;
  border-top: 1px rgba(0,0,0,.12) solid !important;
}

gumga-list tr td < span:nth-child(n+10) {
    background-color:red !important;
}

gumga-list .table-responsive{
  border: none;
}

gumga-list .smart-grid-fixed{
  /*border-: #f5f5f5 !important;*/
}




.pure-checkbox input[type="checkbox"], .pure-radiobutton input[type="checkbox"], .pure-checkbox input[type="radio"], .pure-radiobutton input[type="radio"] {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.pure-checkbox input[type="checkbox"]:focus + label:before, .pure-radiobutton input[type="checkbox"]:focus + label:before, .pure-checkbox input[type="radio"]:focus + label:before, .pure-radiobutton input[type="radio"]:focus + label:before, .pure-checkbox input[type="checkbox"]:hover + label:before, .pure-radiobutton input[type="checkbox"]:hover + label:before, .pure-checkbox input[type="radio"]:hover + label:before, .pure-radiobutton input[type="radio"]:hover + label:before {
  border-color: #4f8196;
  background-color: #f2f2f2;
}

.pure-checkbox input[type="checkbox"]:active + label:before, .pure-radiobutton input[type="checkbox"]:active + label:before, .pure-checkbox input[type="radio"]:active + label:before, .pure-radiobutton input[type="radio"]:active + label:before { transition-duration: 0s; }

.pure-checkbox input[type="checkbox"] + label, .pure-radiobutton input[type="checkbox"] + label, .pure-checkbox input[type="radio"] + label, .pure-radiobutton input[type="radio"] + label {
  position: relative;
  padding-left: 2em;
  vertical-align: middle;
  user-select: none;
  cursor: pointer;
}

.pure-checkbox input[type="checkbox"] + label:before, .pure-radiobutton input[type="checkbox"] + label:before, .pure-checkbox input[type="radio"] + label:before, .pure-radiobutton input[type="radio"] + label:before {
  box-sizing: content-box;
  content: '';
  color: #4f8196;
  position: absolute;
  top: 50%;
  left: 0;
  width: 14px;
  height: 14px;
  margin-top: -9px;
  border: 2px solid #4f8196;
  text-align: center;
  transition: all 0.4s ease;
}

.pure-checkbox input[type="checkbox"] + label:after, .pure-radiobutton input[type="checkbox"] + label:after, .pure-checkbox input[type="radio"] + label:after, .pure-radiobutton input[type="radio"] + label:after {
  box-sizing: content-box;
  content: '';
  background-color: #4f8196;
  position: absolute;
  top: 50%;
  left: 4px;
  width: 10px;
  height: 10px;
  margin-top: -5px;
  transform: scale(0);
  transform-origin: 50%;
  transition: transform 200ms ease-out;
}

.pure-checkbox input[type="checkbox"]:disabled + label:before, .pure-radiobutton input[type="checkbox"]:disabled + label:before, .pure-checkbox input[type="radio"]:disabled + label:before, .pure-radiobutton input[type="radio"]:disabled + label:before { border-color: #cccccc; }

.pure-checkbox input[type="checkbox"]:disabled:focus + label:before, .pure-radiobutton input[type="checkbox"]:disabled:focus + label:before, .pure-checkbox input[type="radio"]:disabled:focus + label:before, .pure-radiobutton input[type="radio"]:disabled:focus + label:before, .pure-checkbox input[type="checkbox"]:disabled:hover + label:before, .pure-radiobutton input[type="checkbox"]:disabled:hover + label:before, .pure-checkbox input[type="radio"]:disabled:hover + label:before, .pure-radiobutton input[type="radio"]:disabled:hover + label:before { background-color: inherit; }

.pure-checkbox input[type="checkbox"]:disabled:checked + label:before, .pure-radiobutton input[type="checkbox"]:disabled:checked + label:before, .pure-checkbox input[type="radio"]:disabled:checked + label:before, .pure-radiobutton input[type="radio"]:disabled:checked + label:before { background-color: #cccccc; }

.pure-checkbox input[type="checkbox"] + label:after, .pure-radiobutton input[type="checkbox"] + label:after {
  background-color: transparent;
  top: 50%;
  left: 4px;
  width: 8px;
  height: 3px;
  margin-top: -4px;
  border-style: solid;
  border-color: #ffffff;
  border-width: 0 0 3px 3px;
  border-image: none;
  transform: rotate(-45deg) scale(0);
}

.pure-checkbox input[type="checkbox"]:checked + label:after, .pure-radiobutton input[type="checkbox"]:checked + label:after {
  content: '';
  transform: rotate(-45deg) scale(1);
  transition: transform 200ms ease-out;
}

.pure-checkbox input[type="radio"]:checked + label:before, .pure-radiobutton input[type="radio"]:checked + label:before {
  animation: borderscale 300ms ease-in;
  background-color: white;
}

.pure-checkbox input[type="radio"]:checked + label:after, .pure-radiobutton input[type="radio"]:checked + label:after { transform: scale(1); }

.pure-checkbox input[type="radio"] + label:before, .pure-radiobutton input[type="radio"] + label:before, .pure-checkbox input[type="radio"] + label:after, .pure-radiobutton input[type="radio"] + label:after { border-radius: 50%; }

.pure-checkbox input[type="checkbox"]:checked + label:before, .pure-radiobutton input[type="checkbox"]:checked + label:before {
  animation: borderscale 200ms ease-in;
  background: #4f8196;
}

.pure-checkbox input[type="checkbox"]:checked + label:after, .pure-radiobutton input[type="checkbox"]:checked + label:after { transform: rotate(-45deg) scale(1); }

@keyframes
borderscale {  50% {
 box-shadow: 0 0 0 2px #4f8196;
}
}

`;
