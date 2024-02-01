
    // Modal Image Gallery
    function onClick(element) {
        document.getElementById("img01").src = element.src;
        document.getElementById("modal01").style.display = "block";
        var captionText = document.getElementById("caption");
        captionText.innerHTML = element.alt;
    }

   
      
    // Used to toggle the menu on small screens when clicking on the menu button
    function toggleFunction() {
        var x = document.getElementById("navDemo");
        var navbar = document.getElementById("myNavbar");
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
        myFunction();
    }
        window.console = window.console || function(t) {};

        if (document.location.search.match(/type=embed/gi)) {
        window.parent.postMessage("resize", "*");
        }


      
      
      
      
        const track = document.getElementById("image-track");
        const track2 = document.getElementById("image-track2");

        const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;
        
        const handleOnUp = () => {
          track.dataset.mouseDownAt = "0";  
          track.dataset.prevPercentage = track.dataset.percentage;

          track.dataset.mouseDownAt = "0";  
          track.dataset.prevPercentage = track.dataset.percentage;
        }
        
        const handleOnMove = e => {
          if(track.dataset.mouseDownAt === "0") return;
          
          const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
                maxDelta = window.innerWidth/2 ;
          
          const percentage = (mouseDelta / maxDelta) * -100,
                nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
                nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -150);
          
          track.dataset.percentage = nextPercentage;
          
          track.animate({
            transform: `translate(${nextPercentage}%, -50%)`
          }, { duration: 1200, fill: "forwards" });
          
          for(const image of track.getElementsByClassName("image")) {
            image.animate({
              objectPosition: `${100 + nextPercentage}% center`
            }, { duration: 1200, fill: "forwards" });
          }
        }









        
        
        /* -- Had to add extra lines for touch events -- */
        
        window.onmousedown = e => handleOnDown(e);
        
        window.ontouchstart = e => handleOnDown(e.touches[0]);
        
        window.onmouseup = e => handleOnUp(e);
        
        window.ontouchend = e => handleOnUp(e.touches[0]);
        
        window.onmousemove = e => handleOnMove(e);
        
        window.ontouchmove = e => handleOnMove(e.touches[0]);


  


        var swiper = new Swiper(".slide-content", {
          slidesPerView: 3,
          spaceBetween: 25,
          loop: true,
          centerSlide: 'true',
          fade: 'true',
          grabCursor: 'true',
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
          },
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
      
          breakpoints:{
              0: {
                  slidesPerView: 1,
              },
              520: {
                  slidesPerView: 2,
              },
              950: {
                  slidesPerView: 3,
              },
          },
        });