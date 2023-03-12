export type TodoCreateDTO = {
    id: string;
    title: string;
    desc: string;
}

export type TodoUpdateDTO = {
    id: string;
    title?: string;
    desc?: string;
    isDone?: boolean;
}