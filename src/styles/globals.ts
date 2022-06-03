import tw from 'tailwind-styled-components'

export const Title = tw.h1`m-8 text-center text-4xl font-bold`
export const UIContainer = tw.div`mx-auto my-4 flex flex-col lg:flex-row`
export const Divider = tw.div`divider lg:divider-horizontal`
export const Card = tw.div`card rounded-box grid flex-grow place-items-center bg-base-200 p-8 shadow-lg`
export const Select = tw.select`select select-bordered my-2 w-full max-w-xs shadow-md`
export const FormControl = tw.div`form-control my-2`
export const FormLabel = tw.label`input-group shadow-md my-2`
export const Stat = tw.div`stats shadow-lg`
export const StatCenter = tw.div`stat place-items-center`
export const StatTitle = tw.div`stat-title`
export const StatValue = tw.div`stat-value mb-2 text-primary`
export const StatDesc = tw.div`stat-desc`
export const Input = tw.input`input input-bordered w-full`
export const Label = tw.span`min-w-fit`
export const CardTitle = tw.h1`stat-value pb-4 text-secondary`
