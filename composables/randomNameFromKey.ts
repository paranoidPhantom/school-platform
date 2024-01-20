const seededRandom = (seed: number) => {
    const mask = 0xffffffff;
    let m_w  = (123456789 + seed) & mask;
    let m_z  = (987654321 - seed) & mask;

    return function() {
      m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;

      let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
      result /= 4294967296;
      return result;
    }
}

const hashString = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        const character = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash |= 0; // Convert to 32-bit integer
    }
    return hash;
}

export const useRandomNameFromKey = (key: string) => {
	const half_a = ["Мишка", "Петька", "Ванька", "Вовка", "Лёшка", "Толик", "Витька", "Андрюха"]
	const half_b = ["Лысый", "Гуцул", "Цыган", "Академик", "Арап", "Зима", "Крученый", "Курок", "Трэш", "Тыр", "Клямпер", "Мальчик", "Кривой", "Бэн", "Силя", "Пашканчик", "Миша -терминатор", "Батон", "Кот", "Сика", "Шапито", "Репа", "Мозг", "Боров", "Свин", "Свинец", "Навзик", "Чиж", "Лещ", "Чиркан", "Молодой", "Панк", "Пышный", "Бух", "Бокс", "Губастый", "Клюй", "Васек", "Крыл", "Фрол", "Базай", "Воробей", "Питон", "Люссак", "Пидаль", "Блин", "Федот", "Боб", "Зевс", "Кабан"]
    const seed = hashString(key);
    const random = seededRandom(seed);
    const nickname = `${half_a[Math.floor(random() * half_a.length)]} ${half_b[Math.floor(random() * half_b.length)]}`;

    return nickname;
}