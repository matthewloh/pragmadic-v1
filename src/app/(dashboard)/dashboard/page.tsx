import { AutumnFireGradient } from "@/components/gradients"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { getUserAuth } from "@/lib/auth/utils"
import { outfit, sen } from "@/utils/fonts"
import { PlusIcon } from "lucide-react"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const { session } = await getUserAuth()

    if (!session) {
        redirect("/login")
    }

    const user = session.user
    const user_roles = session.roles
    return (
        <div
            className={`relative h-full w-full overflow-hidden bg-background text-foreground ${outfit.className}`}
        >
            <AutumnFireGradient />
            <div className="relative z-10">
                <main className="container mx-auto p-6">
                    <div className="mb-10 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            Today is always the most enjoyable day!
                        </p>
                        <h2 className="mt-2 text-4xl font-bold text-primary">
                            Hello, {user?.user_metadata.full_name || "Nomad"} 👋
                        </h2>
                        <div className="mt-6 flex items-center justify-center space-x-6">
                            <Button
                                variant="outline"
                                className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                            >
                                My Adventures
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    0
                                </span>{" "}
                                tasks completed
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    1
                                </span>{" "}
                                collaborator
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-card text-card-foreground shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl text-primary">
                                    Your Tasks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px] pr-4">
                                    <div className="space-y-4">
                                        <TaskItem
                                            title="Plan next destination"
                                            dueDate="Next week"
                                        />
                                        <TaskItem
                                            title="Book accommodation"
                                            dueDate="3 days"
                                        />
                                        <TaskItem
                                            title="Research local cuisine"
                                            dueDate="5 days"
                                        />
                                        <TaskItem
                                            title="Pack essentials"
                                            dueDate="2 days"
                                        />
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                        <Card className="bg-card text-card-foreground shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl text-primary">
                                    Your Projects
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start bg-accent text-accent-foreground hover:bg-accent/90"
                                    >
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Create new project
                                    </Button>
                                    <ProjectItem
                                        title="Travel Blog"
                                        description="3 posts due soon"
                                        color="bg-chart-1"
                                    />
                                    <ProjectItem
                                        title="Photo Gallery"
                                        description="50 photos uploaded"
                                        color="bg-chart-2"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card text-card-foreground shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl text-primary">
                                    Assigned Tasks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    No tasks assigned yet
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card text-card-foreground shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl text-primary">
                                    Your Goals
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add goal
                                    </Button>
                                    <GoalItem
                                        title="Explore 3 new countries"
                                        progress={90}
                                    />
                                    <GoalItem
                                        title="Write 5 blog posts"
                                        progress={75}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}

type TaskItemProps = {
    title: string
    dueDate: string
}

const TaskItem: React.FC<TaskItemProps> = ({ title, dueDate }) => (
    <div className="flex items-center rounded-md p-2 hover:bg-accent/10">
        <input
            type="checkbox"
            className="mr-3 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
        />
        <span className="flex-grow">{title}</span>
        <span className="text-sm text-muted-foreground">Due: {dueDate}</span>
    </div>
)

type ProjectItemProps = {
    title: string
    description: string
    color: string
}

const ProjectItem: React.FC<ProjectItemProps> = ({
    title,
    description,
    color,
}) => (
    <div className="flex items-center space-x-4">
        <div className={`h-10 w-10 rounded-md ${color}`} />
        <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
)

type GoalItemProps = {
    title: string
    progress: number
}

const GoalItem: React.FC<GoalItemProps> = ({ title, progress }) => (
    <div>
        <div className="mb-2 flex justify-between text-sm">
            <span>{title}</span>
            <span className="text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
    </div>
)
