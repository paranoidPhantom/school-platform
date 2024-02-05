<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from "#ui/types";
definePageMeta({
    title: "Редактор",
});

const {
    schedule: { subjects: _subjects },
} = useAppConfig();

let today: string | Date = new Date()
today = `${today.getDate() > 9 ? '' : '0'}${today.getDate()}/${today.getMonth() > 9 ? '' : '0'}${today.getMonth()}/${today.getFullYear()}`

let tomorrow: string | Date = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow = `${tomorrow.getDate() > 9 ? '' : '0'}${tomorrow.getDate()}/${tomorrow.getMonth() > 9 ? '' : '0'}${tomorrow.getMonth()}/${tomorrow.getFullYear()}`


const state = reactive({
    input: "# Тут можно писать на языке Markdown!\n---\n\nБольше о форматировании на этом замечательном языке вы можете прочитать [по ссылке](https://skillbox.ru/media/code/yazyk-razmetki-markdown-shpargalka-po-sintaksisu-s-primerami/)",
    subject: undefined,
    date: today,
    date_due: tomorrow,
});

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const router = useRouter();

const subjects = computed(() => {
    const keys = Object.keys(_subjects);
    let retval = [];
    keys.forEach((key) => {
        retval.push({
            id: key,
            icon: _subjects[key].icon,
            label: _subjects[key].full,
        });
    });
    return retval;
});

const validate = (state: any): FormError[] => {
    const errors = [];
    if (!state.input) errors.push({ path: "input", message: "Обязательное поле" });
    if (!state.subject) errors.push({ path: "subject", message: "Обязательное поле" });
    if (!state.date) errors.push({ path: "date", message: "Обязательное поле" });
    if (!state.date_due) errors.push({ path: "date_due", message: "Обязательное поле" });
    if (state.date.length !== 10 || state.date[2] !== "/" || state.date[5] !== "/") errors.push({ path: "date", message: "Неверный формат даты (ДД/ММ/ГГГГ)" });
    if (state.date_due.length !== 10 || state.date_due[2] !== "/" || state.date_due[5] !== "/") errors.push({ path: "date_due", message: "Неверный формат даты (ДД/ММ/ГГГГ)" });
    return errors;
};

const toast = useToast()

const onSubmit = async (event: FormSubmitEvent<any>) => {
	if (!user.value) return
	const { error } = await supabase.from("homework").insert({
		author: user.value.id,
        subject: state.subject.id,
        date: state.date,
        date_due: state.date_due,
        md_text: state.input,
	} as any)
	if (error) {
		toast.add({
			title: "Ошибка",
            description: error.message,
            timeout: 5000,
			color: "red"
		})
	} else {
		router.push("/")
		toast.add({
			title: "Домашнее задание создано",
            description: "Оно появится как будет одобрено модератором",
            timeout: 10000,
            color: "green",
			icon: "i-heroicons-check-badge-20-solid"
		})
	}
}
</script>

<template>
    <div>
        <UCard class="p-2 m-8">
            <UForm @submit="onSubmit" :validate="validate" :state="state" class="space-y-4">
                <h1 class="text-3xl">Загрузка ДЗ</h1>
                <hr class="my-4 opacity-20" />
				<UFormGroup label="Редактор контента" name="input">
					<UTextarea :rows="15" resize v-model="state.input" />
				</UFormGroup>
                <h3 class="text-xl mt-6 mb-2">
                    Предпросмотр сформатированного контента
                </h3>
                <UCard>
                    <ContentFormatter>
                        <MDC :value="state.input" />
                    </ContentFormatter>
                </UCard>
                <hr class="my-4 opacity-20" />
				<UFormGroup label="Предмет" name="subject">
					<UInputMenu :options="subjects" v-model="state.subject">
						<template #option="{ option }">
							<Icon :name="option.icon" />
							<span class="truncate">{{ option.label }}</span>
						</template>
					</UInputMenu>
				</UFormGroup>
				<UFormGroup label="Когда задали (ДД/ММ/ГГГГ)" name="date">
                	<UInput placeholder="31/12/2023" v-model="state.date" />
				</UFormGroup>
				<UFormGroup label="Дата сдачи (ДД/ММ/ГГГГ)" name="date_due">
					<UInput placeholder="31/12/2024" v-model="state.date_due" />
				</UFormGroup>
                <hr class="my-4 opacity-20" />
                <UAlert
                    title="Внимание!"
                    description="После загрузки, отредактировать ДЗ невозможно (пока что)"
                    icon="i-heroicons-exclamation-triangle-16-solid"
                    class="mb-4"
                    color="red"
                    variant="subtle"
                />
                <UButton type="submit" label="Загрузить" variant="soft" />
            </UForm>
        </UCard>
    </div>
</template>

<style lang="scss" scoped></style>
