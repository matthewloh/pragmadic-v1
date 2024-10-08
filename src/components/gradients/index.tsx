export function DashboardGradient() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-[#4b88ff] to-[#ff9797]" />
            <div className="absolute -top-1/4 right-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-b from-[#fdc999] to-[#fd9999]" />
            <div className="absolute bottom-0 right-0 h-1/2 w-1/2 rounded-full bg-gradient-to-b from-[#99cdfd] to-[#e56ebc]" />
            <div className="absolute -left-1/4 top-1/3 h-3/4 w-3/4 rounded-full bg-gradient-to-b from-[#5c62f4] to-[#ff6dc4]" />
            <div className="absolute -left-1/4 bottom-0 h-2/3 w-2/3 rounded-full bg-gradient-to-b from-[#f4655c] to-[#f45cb7]" />
            <div className="backdrop-saturate-70 absolute inset-0 bg-[#4128da]/5 backdrop-blur-[182px]" />
        </div>
    )
}

export function CustomGradient() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="relative h-full w-full rounded-lg bg-gradient-to-bl from-[#ff4b4b] to-[#ff9797]">
                <div className="absolute left-1/2 top-[-20%] h-1/2 w-1/2 -translate-x-1/2 transform rounded-full bg-gradient-to-b from-[#fdc999] to-[#fd9999]" />
                <div className="absolute bottom-[10%] left-3/4 h-1/3 w-1/3 -translate-x-1/2 transform rounded-full bg-gradient-to-b from-[#fda599] to-[#fff7b4]" />
                <div className="absolute left-[-10%] top-[40%] h-3/5 w-3/5 rounded-full bg-gradient-to-b from-[#f45c5c] to-[#ffde9e]" />
                <div className="absolute bottom-0 left-[-10%] h-2/3 w-2/3 rounded-full bg-gradient-to-b from-[#f4655c] to-[#f45cb7]" />
                <div className="absolute inset-0 bg-[#ffc590]/5 backdrop-blur-[182px]" />
            </div>
        </div>
    )
}

export function AdminGradient() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="relative h-full w-full bg-gradient-to-br from-[#243640] to-[#C44E4F]">
                    <div className="absolute right-[-10%] top-[-10%] h-1/2 w-1/2 rounded-full bg-gradient-to-b from-[#DFE2E4] to-[#F3F4F4] opacity-50" />
                    <div className="absolute bottom-[-5%] left-[-5%] h-2/3 w-2/3 rounded-full bg-gradient-to-t from-[#E8D284] to-[#CAB266] opacity-100" />
                    <div className="absolute left-1/4 top-1/4 h-1/3 w-1/3 rounded-full bg-gradient-to-br from-[#2A4F61] to-[#243640] opacity-70" />
                    <div className="absolute inset-0 bg-[#243640]/10 backdrop-blur-[50px]" />
                </div>
            </div>
        </div>
    )
}

export function PagesGradient() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="relative h-full w-full bg-gradient-to-bl from-[#1b8d34] to-[#eef086]">
                <div className="absolute left-[40%] top-[-15%] h-[40%] w-[55%] rotate-12 transform rounded-[40%_60%_70%_30%_/_30%_30%_70%_70%] bg-gradient-to-b from-[#fdf999] via-[#c8f6a7] to-[#5cefc3] opacity-60"></div>
                <div className="-rotate-15 absolute left-[65%] top-[60%] h-[45%] w-[50%] transform rounded-[50%_50%_30%_70%_/_30%_60%_40%_70%] bg-gradient-to-b from-[#fbfd99] to-[#76f0a6] opacity-50"></div>
                <div className="absolute left-[-10%] top-[35%] h-[70%] w-[80%] rotate-6 transform rounded-[30%_70%_70%_30%_/_50%_50%_30%_60%] bg-gradient-to-b from-[#0b8d75] to-[#bcffd6] opacity-40"></div>
                <div className="absolute left-[-5%] top-[50%] h-[60%] w-[65%] -rotate-3 transform rounded-[70%_30%_50%_50%_/_60%_40%_60%_40%] bg-gradient-to-b from-[#05cc61] to-[#a1ffc1] opacity-30"></div>
                <div className="absolute inset-0 bg-[#5f8a29]/5 backdrop-blur-[60px]"></div>
            </div>
        </div>
    )
}

export function AutumnFireGradient() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="relative h-full w-full bg-gradient-to-br from-[#FFBB55] via-[#D15D4C] to-[#1F4F8E]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#FFBB55] via-transparent to-transparent opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#C44B4E] to-transparent opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#1F4F8E] to-[#0A2342] opacity-90"></div>
                <div className="bg-gradient-radial absolute left-[-20%] top-[-50%] h-[70%] w-[70%] rounded-full from-[#FFF3E0] via-[#FFBB55] to-transparent opacity-40 blur-2xl"></div>
                {/* <div className="absolute inset-0 backdrop-blur-[2px]"></div> */}
            </div>
        </div>
    )
}
