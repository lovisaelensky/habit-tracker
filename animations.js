

const spiderweb = document.querySelector(".spiderweb");
const spider = document.querySelector(".spider");
const cockRoach = document.querySelector('.cockroach-container');

spiderweb.addEventListener("mouseover", moveSpider);
//spider.addEventListener("mouseover", bounceSpider);

function moveSpider () {
   // console.log("Ahh a spider!!");
    spider.classList.remove("spider");
    spider.classList.add("animate__slideInDown");
    spider.classList.add("animate__animated");
    setTimeout(exitSpider, 6000);
}



function exitSpider () {
    spider.classList.add("animate__slideOutUp");
   // console.log("U going?")
} 




