export const giftStepIds = [1, 2, 3] as const;

export type GiftStepId = (typeof giftStepIds)[number];

export interface GiftStep {
	id: GiftStepId;
	title: string;
	clue: string;
	message: string;
	illustration: string;
	nextStep: GiftStepId | null;
	isFinalTrigger: boolean;
}

export const giftSteps = [
	{
		id: 1,
		title: 'Jejak Hangat Pertama',
		clue: 'Cari sudut rumah tempat kita biasa duduk santai dan berbagi cerita.',
		message:
			'Terima kasih sudah membuat setiap waktu sederhana terasa hangat. Senyummu selalu jadi tempat pulang favoritku.',
		illustration: '/assets/illustrations/sofa-corner.webp',
		nextStep: 2,
		isFinalTrigger: false
	},
	{
		id: 2,
		title: 'Bekal untuk Petualangan',
		clue: 'Petunjuk berikutnya bersembunyi dekat teman yang selalu menemanimu saat bepergian.',
		message:
			'Bersamamu, perjalanan kecil sekalipun selalu terasa istimewa. Semoga kita terus punya banyak cerita untuk dibawa pulang.',
		illustration: '/assets/illustrations/bag-and-cup.webp',
		nextStep: 3,
		isFinalTrigger: false
	},
	{
		id: 3,
		title: 'Pantulan Paling Manis',
		clue: 'Lihat ke tempat yang setiap hari memantulkan sosok paling cantik di rumah ini.',
		message:
			'Orang cantik di depan cermin itu adalah alasan banyak hariku terasa lebih cerah. Satu kejutan terakhir sedang menunggumu.',
		illustration: '/assets/illustrations/mirror-table.webp',
		nextStep: null,
		isFinalTrigger: true
	}
] as const satisfies readonly GiftStep[];

export function isGiftStepId(value: unknown): value is GiftStepId {
	return giftStepIds.some((stepId) => stepId === value);
}

export function getGiftStep(stepId: GiftStepId): GiftStep {
	return giftSteps.find((step) => step.id === stepId) as GiftStep;
}
