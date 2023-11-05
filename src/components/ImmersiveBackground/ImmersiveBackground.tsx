import { createEffect, onCleanup, onMount, createSignal } from "solid-js";
import { currentAlbumArt, immersiveBackground } from "../../stores/store";

function ImmersiveBackground(props) {
  let canvasRef;
  let animationFrameId;
  let image = "../../assets/transparent.png";
  let oldImage = "../../assets/transparent.png";
  let fadeAmount = 1;
  let newFadeAmount = 0;
  let isFading = false;
  let rotation = 0;
  let xTranslation = 0;
  let yTranslation = 0;
  let maxTranslationX = Math.round(window.innerWidth / 6);
  let maxTranslationY = Math.round(window.innerHeight / 6);
  const [imageLoaded, setImageLoaded] = createSignal(false);

  const xDirection = Math.random() < 0.5 ? -1 : 1;
  const yDirection = Math.random() < 0.5 ? -1 : 1;
  const xSpeed = Math.random() * 0.3;
  const ySpeed = Math.random() * 0.3;

  createEffect(() => {
    if (image.src !== currentAlbumArt.value) {
      if (image.src) {
        oldImage = new Image();
        oldImage.src = image.src;
        oldImage.onload = () => {
          fadeAmount = 1;
          newFadeAmount = 0;
        };
      }

      image = new Image();
      image.onload = () => {
        setImageLoaded(true);
        if (isFading) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(updateCanvas);
        }
      };
      image.onerror = () => {
        setImageLoaded(false);
        isFading = false;
      };
      image.src =
        currentAlbumArt.value + "?cacheBuster=" + new Date().getTime();
      setImageLoaded(false);
      isFading = true;
    }
  });

  const updateCanvas = () => {
    const ctx = canvasRef.getContext("2d");
    const width = canvasRef.width;
    const height = canvasRef.height;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2 + xTranslation, height / 2 + yTranslation);
    rotation += 0.001;
    ctx.rotate(rotation);
    ctx.translate(-width / 2, -height / 2);
    ctx.filter = "blur(80px) contrast(1.5)";
    ctx.imageSmoothingEnabled = true;

    if (
      oldImage &&
      oldImage.complete &&
      oldImage.naturalWidth !== 0 &&
      fadeAmount > 0
    ) {
      ctx.globalAlpha = fadeAmount;
      ctx.drawImage(oldImage, 0, 0, width * 1.5, height * 1.5);
      fadeAmount -= 0.005;
    }

    if (
      image.complete &&
      image.naturalWidth !== 0 &&
      imageLoaded() &&
      fadeAmount <= 0
    ) {
      ctx.globalAlpha = newFadeAmount;
      ctx.drawImage(image, 0, 0, width * 1.5, height * 1.5);
      newFadeAmount += 0.005;
    }

    if (
      image.complete &&
      image.naturalWidth !== 0 &&
      imageLoaded() &&
      newFadeAmount < 1
    ) {
      ctx.globalAlpha = newFadeAmount;
      ctx.drawImage(image, 0, 0, width * 1.5, height * 1.5);
      newFadeAmount += 0.005;
    } else if (newFadeAmount >= 1) {
      ctx.globalAlpha = 1;
      ctx.drawImage(image, 0, 0, width * 1.5, height * 1.5);
    }

    ctx.restore();

    xTranslation += xDirection * xSpeed;
    yTranslation += yDirection * ySpeed;

    xTranslation = Math.max(
      Math.min(xTranslation, maxTranslationX),
      -maxTranslationX
    );
    yTranslation = Math.max(
      Math.min(yTranslation, maxTranslationY),
      -maxTranslationY
    );

    if (fadeAmount <= 0 && newFadeAmount < 1) {
      newFadeAmount += 0.005;
    } else if (newFadeAmount === 1) {
      newFadeAmount = 1;
      isFading = true;
    }
    animationFrameId = requestAnimationFrame(updateCanvas);
  };

  const updateCanvasSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Update the canvas dimensions
    canvasRef.width = width;
    canvasRef.height = height;

    // Update the max translations based on the new dimensions
    maxTranslationX = Math.round(width / 6);
    maxTranslationY = Math.round(height / 6);
  };

  onMount(() => {
    image.onload = () => {
      setImageLoaded(true);
      fadeAmount = 0;
      newFadeAmount = 0.1;
      animationFrameId = requestAnimationFrame(updateCanvas);
    };
    image.onerror = () => {
      setImageLoaded(false);
    };
    // Trigger loading the first image
    image.src = currentAlbumArt.value + "?cacheBuster=" + new Date().getTime();

    window.addEventListener("resize", updateCanvasSize);

    updateCanvasSize();
  });

  onCleanup(() => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener("resize", updateCanvasSize);
  });

  return (
    <canvas
      ref={(el) => (canvasRef = el)}
      width="100%"
      height="100%"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        display: immersiveBackground.value ? "block" : "none"
      }}
    />
  );
}

export default ImmersiveBackground;
