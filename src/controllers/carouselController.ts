type Slide = {
  id: number,
  name: string,
  style: { opacity: number }
}

export default class CarouselController {
  slides: Slide[] = []
  animateId: number = 1
  constructor(slides: any = []) {
    this.slides = slides
    this.startAnimation()
  }

  getSlides(): any {
    return this.slides
  }

  stopAnimation() {
    window.clearInterval(this.animateId)
  }

  startAnimation() {
    this.animateId = window.setInterval(() => {
      this.next()
    }, 3000)
  }

  next() {
    this.stopAnimation()

    // Take the first element and add it at the end
    const first: any = this.slides.shift();
    this.updateStyleOpacity(first);
    this.slides = [...this.slides, first];
  }

  previous() {
    this.stopAnimation()
    // Save the last element and then add it back to the slides
    // at the beginning
    const last: any = this.slides.pop();
    this.updateStyleOpacity(last);
    this.slides = [last, ...this.slides];
  }

  updateStyleOpacity(slide: Slide) {
    this.slides.forEach((el:Slide) => {
      el.style.opacity = 1
    });
    slide.style.opacity = 0
    this.startAnimation()
  }
}