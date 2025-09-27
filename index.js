// --- Cube Animation ---
const cubeCanvas = document.getElementById("cube-canvas");
if(cubeCanvas){
  const renderer = new THREE.WebGLRenderer({ canvas: cubeCanvas, alpha: true });
  renderer.setSize(cubeCanvas.clientWidth, cubeCanvas.clientHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, cubeCanvas.clientWidth / cubeCanvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0xff4da6 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(5,5,5);
  scene.add(light);

  function animateCube(){
    requestAnimationFrame(animateCube);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animateCube();
}

// --- Coming Soon Popup ---
document.querySelectorAll(".coming-soon").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("🚀 Coming Soon!");
  });
});

