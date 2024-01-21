type teacher =
	| keyof typeof schedule.teachers
	| (keyof typeof schedule.teachers)[];
type location =
	| keyof typeof schedule.locations
	| (keyof typeof schedule.locations)[];

interface lesson {
	subject: keyof typeof schedule.subjects;
	teacher: teacher;
	location: location;
}
interface subject {
    full: string;
    short: string;
    icon: string;
}

export { teacher, location, lesson, subject }