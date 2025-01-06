import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function LoginForm({ hideCardStyle = false }) {
  return (
    <Card
      className={`mx-auto max-w-sm ${hideCardStyle ? "p-0 border-none" : ""}`}
    >
      <CardHeader className={hideCardStyle ? "hidden" : ""}>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent className={hideCardStyle ? "p-0 w-full" : ""}>
        <div className="grid gap-4 w-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                autoComplete="off"
                id="first-name"
                placeholder="Alexander"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Pedersen" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoComplete="off"
              type="email"
              placeholder="xx@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              autoComplete="off"
              type="password"
              placeholder="********"
            />
          </div>
          <Button type="submit" className="w-full">
            Create an account
          </Button>
          <Button variant="outline" className="w-full">
            <Github className="w-4 h-4 mr-2" />
            Sign up with GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
