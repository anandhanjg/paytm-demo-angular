import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
declare var window:any;

@Component({
  selector: 'app-pay-money',
  templateUrl: './pay-money.component.html',
  styleUrls: ['./pay-money.component.css']
})
export class PayMoneyComponent implements OnInit,AfterViewInit {
  @Input() config:any;
  @Input() mid:string;
  url:string="https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/"
  initialConfig:any;  
  loadScript=false;
  show:boolean=false;
  constructor(){}
  ngOnInit(): void {  
    this.url=this.url+this.mid+'.js';
  }

  ngAfterViewInit():void{
    if(!this.loadScript)
      this.scriptLoader().then(()=>{
        console.log("HELLO I AM HERE");  
        this.initialConfig={
            "root":"",
            "flow":"DEFAULT",
            "data":{
              "orderId":this.config.orderId,
              "token":this.config.txnToken,
              "tokenType":"TXN_TOKEN",
              "amount":this.config.amount
            },
            "handler":{
              "notifyMerchant":function(eventName,data){
                  console.log("notifyMerchant handler function called");
                  console.log("eventName => ",eventName);
                  console.log("data => ",data);
              }
            }
          }
          document.getElementById('pay_money').style.display="block";          
      });
  }



  scriptLoader(){
      let self=this;
        return new Promise((resolve,reject)=>{
            let s=document.createElement('script');
            s.onload=resolve;
            s.src=self.url;
            document.head.appendChild(s);            
        });
      
  }

  payMoney():void{
      console.log(this.initialConfig);
      window.Paytm.CheckoutJS.init(this.initialConfig).then(function onSuccess(){
          window.Paytm.CheckoutJS.invoke();
      }).catch(function onError(error){
          console.log("error=>",error);
      });
  }

}
