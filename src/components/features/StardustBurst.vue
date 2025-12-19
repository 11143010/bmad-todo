<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  x: number;
  y: number;
}>();

const emit = defineEmits<{
  (e: "complete"): void;
}>();

const particles = ref<
  Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    angle: number;
    speed: number;
    opacity: number;
  }>
>([]);

const colors: readonly string[] = [
  "var(--nebula-cyan)",
  "var(--nebula-purple)",
  "var(--nebula-pink)",
  "var(--starlight)",
] as const;

let animationId: number;
let startTime: number;

const PARTICLE_COUNT = 12;
const ANIMATION_DURATION = 600; // ms

onMounted(() => {
  // Generate particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.value.push({
      id: i,
      x: 0,
      y: 0,
      size: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      angle: (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.5,
      speed: 50 + Math.random() * 80,
      opacity: 1,
    });
  }

  startTime = Date.now();
  animate();
});

const animate = (): void => {
  const elapsed = Date.now() - startTime;
  const progress = elapsed / ANIMATION_DURATION;

  if (progress >= 1) {
    emit("complete");
    return;
  }

  particles.value = particles.value.map((p) => ({
    ...p,
    x: Math.cos(p.angle) * p.speed * progress,
    y: Math.sin(p.angle) * p.speed * progress,
    opacity: 1 - progress,
    size: p.size * (1 - progress * 0.5),
  }));

  animationId = requestAnimationFrame(animate);
};

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<template>
  <div
    class="fixed pointer-events-none z-50"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="absolute rounded-full"
      :style="{
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        background: particle.color,
        boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
        transform: `translate(${particle.x}px, ${particle.y}px)`,
        opacity: particle.opacity,
      }"
    ></div>
  </div>
</template>
