
export default class Radius{

    constructor(props)
    {
        this.props = props

        
    }

    initialX=0;
    initialY=0;
    x2=0;
    y2=0;
    isTop=false;
    isLeft=false;
    
    
   resize= (e) => {


        
         // e.preventDefault();
    
          let comp = this.props.store.components[this.props.id];
          let x= comp.crop.x1;
          let y = comp.crop.y1;
          let w = comp.crop.w;
          let h = comp.crop.h;
          //let x2 = x + w;

          if(this.isTop && this.isLeft)
          {
            let rr
            //console.log(rr);
            if(comp.crop.tlr > 0)
              rr = (comp.crop.tlr);
            else
              rr =0;

            rr +=  (e.clientY || e.touches[0].clientY) - this.initialY ;

            
            //console.log(rr);
            if(rr <= this.maxR && rr >=0)
            {
              let lty =(rr) - (rr* Math.sin(0.785398));
              let ltx =(rr) - (rr* Math.cos(0.785398));
             
                this.props.store.update(this.props.id,"crop",{tlr:rr,lty:lty,ltx:ltx})
                this.initialY = (e.clientY || e.touches[0].clientY);
            }

             
          }
          else if (this.isTop && !this.isLeft)
          {
              let rr
              //console.log(rr);
              if(comp.crop.trr > 0)
                rr = (comp.crop.trr);
              else
                rr =0;

              rr +=  (e.clientY || e.touches[0].clientY) - this.initialY ;

              
              //console.log(rr);
              if(rr <= this.maxR && rr >=0)
              {
                let rty =(rr) - (rr* Math.sin(0.785398));
                let rtx =(rr) - (rr* Math.cos(0.785398));
                this.props.store.update(this.props.id,"crop",{trr:rr,rty:rty,rtx:rtx})
                this.initialY = (e.clientY || e.touches[0].clientY);
              }


          }
          else if (!this.isTop && !this.isLeft)
          {
              let rr
              //console.log(rr);
              if(comp.crop.brr > 0)
                rr = (comp.crop.brr);
              else
                rr =0;

              rr += this.initialY - (e.clientY || e.touches[0].clientY)  ;

              
              //console.log(rr);
              if(rr <= this.maxR && rr >=0)
              {
                let rby =(rr) - (rr* Math.sin(0.785398));
                let rbx =(rr) - (rr* Math.cos(0.785398));
                this.props.store.update(this.props.id,"crop",{brr:rr,rby:rby,rbx:rbx})
                this.initialY = (e.clientY || e.touches[0].clientY);
              }


          }
          else if (!this.isTop && this.isLeft)
          {
              let rr
              //console.log(rr);
              if(comp.crop.blr > 0)
                rr = (comp.crop.blr);
              else
                rr =0;

              rr += this.initialY - (e.clientY || e.touches[0].clientY)  ;

              
              //console.log(rr);
              if(rr <= this.maxR && rr >=0)
              {
                let lby =(rr) - (rr* Math.sin(0.785398));
                let lbx =(rr) - (rr* Math.cos(0.785398));
                this.props.store.update(this.props.id,"crop",{blr:rr,lby:lby,lbx:lbx})
                this.initialY = (e.clientY || e.touches[0].clientY);
              }


          }
         
        
     
    }
    
    resizeEnd=(e)=>{
        document.removeEventListener("mousemove",this.resize)
        document.removeEventListener("mouseup",this.resizeEnd)
        document.removeEventListener("touchmove",this.resize)
        document.removeEventListener("touchend",this.resizeEnd)
    
      }
    
     resizeStart=(e,isTop,isLeft)=> {
      
        if(!this.props.drawing.state.draw){
         
          //this.select();
          //console.log(e)


          
          this.isTop = isTop;
          this.isLeft = isLeft;
          this.initialX = (e.clientX || e.touches[0].clientX);
          this.initialY = (e.clientY || e.touches[0].clientY);
          let comp = this.props.store.components[this.props.id];
          this.maxR = comp.crop.w>comp.crop.h?comp.crop.w/2:comp.crop.h/2;
          //this.r = comp.crop.w/2
        

         // alert(this.maxR)
          document.addEventListener("mouseup",this.resizeEnd,false)
          document.addEventListener("touchend",this.resizeEnd,false)

          document.addEventListener("mousemove",this.resize,false)
          document.addEventListener("touchmove",this.resize,false)
          
    }
  }


}

