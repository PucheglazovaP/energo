import { UpdateFunction } from '../types';

export default class Animation {
	#updates: UpdateFunction[] = [];
	#renders: UpdateFunction[] = [];
	#lastTime: number = 0;
	#runningAnimation: number | null = null;

	addUpdate(updateFunction: UpdateFunction) {
		this.#updates.push(updateFunction);
	}

	addRender(renderFunction: UpdateFunction) {
		this.#renders.push(renderFunction);
	}

	animate(timestamp: number) {
		const deltaTime = timestamp - this.#lastTime;
		this.#lastTime = timestamp;
		for (const update of this.#updates) update(deltaTime);
		for (const render of this.#renders) render(deltaTime);
		this.#runningAnimation = requestAnimationFrame(this.animate.bind(this));
	}

	stop() {
		if (this.#runningAnimation != null)
			cancelAnimationFrame(this.#runningAnimation);
	}
}
