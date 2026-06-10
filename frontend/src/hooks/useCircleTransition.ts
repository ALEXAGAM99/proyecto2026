/**
 * useCircleTransition
 * Implementa el efecto de transición circular (ripple/circle) usando la View Transitions API.
 * La animación parte desde las coordenadas del botón que fue presionado.
 */

type TransitionCallback = () => void;

interface CircleTransitionOptions {
  /** Duración en ms. Por defecto: 1500 */
  duration?: number;
  /** Easing. Por defecto: 'ease-in' */
  easing?: string;
  /** blur del borde */
  blur?: number;
}

/**
 * Lanza una transición circular que parte desde el punto (x, y) en la pantalla.
 * @param x        Coordenada X del punto de origen (centro del botón)
 * @param y        Coordenada Y del punto de origen (centro del botón)
 * @param callback Función que realiza el cambio de estado (setTheme, setColorTheme, etc.)
 * @param options  Configuración opcional
 */
export function startCircleTransition(
  x: number,
  y: number,
  callback: TransitionCallback,
  options: CircleTransitionOptions = {}
): void {
  const { duration = 1800, easing = "ease-in", blur = 20 } = options;

  // Fallback para navegadores sin soporte (Firefox, etc.)
  if (!document.startViewTransition) {
    callback();
    return;
  }

  // Calcular la distancia al rincón más lejano de la pantalla
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // Inyectar estilos temporales para desactivar la transición por defecto
  // y permitir que el clip-path circular funcione correctamente
  const style = document.createElement("style");
  style.id = "__circle-transition-style__";
  style.textContent = `
    ::view-transition-image-pair(root) { isolation: auto; }
    ::view-transition-old(root), ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
      display: block;
    }
      ::view-transition-image-pair(root) {
      isolation: auto;
    }

    ::view-transition-new(root) {

      mask:
        url("data:image/svg+xml,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
<defs>
<filter id='blur'>
<feGaussianBlur stdDeviation='${blur / 4}' />
</filter>
</defs>
<circle cx='50' cy='50' r='40' fill='white' filter='url(%23blur)'/>
</svg>")
        center / 0 no-repeat;

      will-change:
        mask-size;

      transform:
        translateZ(0);
    }

    ::view-transition-old(root) {
      z-index: -1;
    }
  `;

  // Evitar duplicados si se hace clic rápido
  document.getElementById("__circle-transition-style__")?.remove();
  document.head.appendChild(style);

  const transition = document.startViewTransition(() => {
    callback();
  });

  // Animar el nuevo "layer" con clip-path circular desde el punto de origen
  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
          `blur(12px) brightness(1.3)`,
          `blur(0px) brightness(1)`,
        ],
      },
      {
        duration,
        easing,
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });

  // Limpiar el <style> inyectado cuando termine la transición
  transition.finished.then(() => {
    document.getElementById("__circle-transition-style__")?.remove();
  });
}

/**
 * Obtiene las coordenadas del centro de un elemento HTML.
 * Úsalo como origen del círculo: getElementCenter(e.currentTarget)
 */
export function getElementCenter(el: HTMLElement): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}
