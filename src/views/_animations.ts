export const ANIMATIONS_CSS = `

/* ==== FLIP ==== */

.flip {
	-webkit-animation: flip 4s cubic-bezier(0.455, 0.030, 0.515, 0.955) infinite both;
	animation: flip 4s cubic-bezier(0.455, 0.030, 0.515, 0.955) infinite both;
}

@-webkit-keyframes flip {
  0% {
    -webkit-transform: rotateX(0);
            transform: rotateX(0);
  }
  100% {
    -webkit-transform: rotateX(-180deg);
            transform: rotateX(-180deg);
  }
}
@keyframes flip {
  0% {
    -webkit-transform: rotateX(0);
            transform: rotateX(0);
  }
  100% {
    -webkit-transform: rotateX(-180deg);
            transform: rotateX(-180deg);
  }
}


/* ==== SPIN ==== */

.spin {
    animation: spin 3s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}`;