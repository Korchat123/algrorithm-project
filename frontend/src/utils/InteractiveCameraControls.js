import * as THREE from 'three';

export class InteractiveCameraControls {
  constructor(camera, domElement, options = {}) {
    this.camera = camera;
    this.domElement = domElement;

    this.options = {
      rotationSpeed: options.rotationSpeed || 0.005,
      zoomSpeed: options.zoomSpeed || 0.1,
      minZoom: options.minZoom || 1,
      maxZoom: options.maxZoom || 100,
      damping: options.damping || 0.95,
      resetDuration: options.resetDuration || 600,
      ...options,
    };

    this.isPressed = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.currentZoom = this.camera.position.length();
    this.targetZoom = this.currentZoom;

    this.originalPosition = this.camera.position.clone();
    this.originalLookAt = new THREE.Vector3(0, 0, 0);

    this.animationFrameId = null;
    this.isResetting = false;
    this.resetStartTime = null;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.animate = this.animate.bind(this);

    this.attachEventListeners();
    this.startAnimation();
  }

  attachEventListeners() {
    this.domElement.addEventListener('mousedown', this.onMouseDown);
    this.domElement.addEventListener('mousemove', this.onMouseMove);
    this.domElement.addEventListener('mouseup', this.onMouseUp);
    this.domElement.addEventListener('wheel', this.onMouseWheel, { passive: false });
    this.domElement.addEventListener('dblclick', this.onDoubleClick);
    this.domElement.addEventListener('mouseleave', this.onMouseUp);
  }

  detachEventListeners() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('wheel', this.onMouseWheel);
    this.domElement.removeEventListener('dblclick', this.onDoubleClick);
    this.domElement.removeEventListener('mouseleave', this.onMouseUp);
  }

  onMouseDown(event) {
    if (event.button === 0) {
      this.isPressed = true;
      this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }
  }

  onMouseMove(event) {
    if (!this.isPressed) return;

    const deltaX = event.clientX - this.previousMousePosition.x;
    const deltaY = event.clientY - this.previousMousePosition.y;

    this.targetRotation.y += deltaX * this.options.rotationSpeed;
    this.targetRotation.x += deltaY * this.options.rotationSpeed;
    this.targetRotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.targetRotation.x)
    );

    this.previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  onMouseUp() {
    this.isPressed = false;
  }

  onMouseWheel(event) {
    event.preventDefault();

    const direction = event.deltaY > 0 ? 1 : -1;
    this.targetZoom += direction * this.options.zoomSpeed;
    this.targetZoom = Math.max(
      this.options.minZoom,
      Math.min(this.options.maxZoom, this.targetZoom)
    );
  }

  onDoubleClick() {
    this.resetView();
  }

  resetView() {
    this.isResetting = true;
    this.resetStartTime = Date.now();
    this.targetRotation = { x: 0, y: 0 };
    this.targetZoom = this.originalPosition.length();
  }

  startAnimation() {
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  animate() {
    const easing = 1 - this.options.damping;

    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * easing;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * easing;
    this.currentZoom += (this.targetZoom - this.currentZoom) * easing;

    if (this.isResetting && this.resetStartTime) {
      const elapsed = Date.now() - this.resetStartTime;
      if (elapsed >= this.options.resetDuration) {
        this.isResetting = false;
        this.resetStartTime = null;
      }
    }

    this.updateCameraPosition();
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  updateCameraPosition() {
    const x =
      this.currentZoom * Math.sin(this.currentRotation.y) * Math.cos(this.currentRotation.x);
    const y = this.currentZoom * Math.sin(this.currentRotation.x);
    const z =
      this.currentZoom * Math.cos(this.currentRotation.y) * Math.cos(this.currentRotation.x);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.originalLookAt);
  }

  dispose() {
    this.detachEventListeners();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
