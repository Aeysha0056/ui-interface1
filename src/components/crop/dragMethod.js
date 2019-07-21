
export default class Drag {

    constructor(props)
    {
        this.props = props
    }

    initialX=0;
    initialY=0;
    
   select = ()=>{
       this.props.store.select(this.props.id)
       //this.container.current.addEventListener("mousedown",dragStart,false)
    }
    
   drag= (e) => {
       
        
         // e.preventDefault();
    
    
          let comp = this.props.store.components[this.props.id];
          let {crop} = comp;
          let x = comp.crop.x1 + (e.clientX || e.touches[0].clientX) - this.initialX;
          let y = comp.crop.y1 + (e.clientY || e.touches[0].clientY) - this.initialY;
          this.props.store.update(this.props.id,"crop",{x1:x,y1:y})
    
          this.initialX = (e.clientX || e.touches[0].clientX);
          this.initialY = (e.clientY || e.touches[0].clientY);
     
    }
    
    dragEnd=(e)=>{
        document.removeEventListener("mousemove",this.drag)
        document.removeEventListener("mouseup",this.dragEnd)
        document.removeEventListener("touchmove",this.drag)
        document.removeEventListener("touchend",this.dragEnd)
    
      }
    
     dragStart=(e)=> {
        if(!this.props.drawing.state.draw){
      //  e.preventDefault();
          this.select();
          this.initialX = (e.clientX || e.touches[0].clientX);
          this.initialY = (e.clientY || e.touches[0].clientY);

          document.addEventListener("mouseup",this.dragEnd,false)
          document.addEventListener("touchend",this.dragEnd,false)

          document.addEventListener("mousemove",this.drag,false)
          document.addEventListener("touchmove",this.drag,false)
    }
  }
}

