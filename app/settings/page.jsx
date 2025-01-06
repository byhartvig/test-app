"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/common/avatar";
import { logger } from "@/utils/logger";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const TIMEZONES = [
  { value: "Europe/Copenhagen", label: "Copenhagen (UTC+1)" },
  { value: "Europe/London", label: "London (UTC)" },
  { value: "America/New_York", label: "New York (UTC-5)" },
  { value: "Asia/Dubai", label: "Dubai (UTC+4)" },
];

const CURRENCIES = [
  { value: "DKK", label: "Danish Krone (DKK)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "SEK", label: "Swedish Krona (SEK)" },
  { value: "NOK", label: "Norwegian Krone (NOK)" },
];

const TIME_FORMATS = [
  { value: "12h", label: "12-hour (1:00 PM)" },
  { value: "24h", label: "24-hour (13:00)" },
];

const DATE_FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

const LANGUAGES = [
  { value: "da", label: "Dansk" },
  { value: "en", label: "English" },
  { value: "sv", label: "Svenska" },
  { value: "no", label: "Norsk" },
];

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");
  const [timezone, setTimezone] = useState("Europe/Copenhagen");
  const [currency, setCurrency] = useState("DKK");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("24h");
  const [language, setLanguage] = useState("da");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(
          `
          full_name, 
          username, 
          website, 
          avatar_url,
          timezone,
          currency,
          date_format,
          time_format,
          language,
          notifications_enabled,
          email_notifications,
          push_notifications
        `
        )
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name || "");
        setUsername(data.username || "");
        setWebsite(data.website || "");
        setAvatarUrl(data.avatar_url || "");
        setTimezone(data.timezone || "Europe/Copenhagen");
        setCurrency(data.currency || "DKK");
        setDateFormat(data.date_format || "DD/MM/YYYY");
        setTimeFormat(data.time_format || "24h");
        setLanguage(data.language || "da");
        setNotificationsEnabled(data.notifications_enabled ?? true);
        setEmailNotifications(data.email_notifications ?? true);
        setPushNotifications(data.push_notifications ?? true);
      }
    } catch (error) {
      logger.error("Error loading user profile", {
        userId: user?.id,
        error: error.message,
      });
      toast.error("Fejl ved indlæsning af brugerdata");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  async function updateProfile(values) {
    try {
      setLoading(true);

      const updates = {
        id: user?.id,
        updated_at: new Date().toISOString(),
        ...values,
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;

      toast.success("Indstillinger gemt");
    } catch (error) {
      logger.error("Error updating profile", {
        userId: user?.id,
        error: error.message,
      });
      toast.error("Fejl ved opdatering af data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Indstillinger</h1>
        <p className="text-muted-foreground">
          Administrer dine kontoindstillinger og præferencer.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Generelt</TabsTrigger>
          <TabsTrigger value="preferences">Præferencer</TabsTrigger>
          <TabsTrigger value="notifications">Notifikationer</TabsTrigger>
          <TabsTrigger value="security">Sikkerhed</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profiloplysninger</CardTitle>
              <CardDescription>
                Opdater dine profiloplysninger og indstillinger.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Avatar
                  uid={user?.id}
                  url={avatar_url}
                  size={150}
                  onUpload={(url) => {
                    setAvatarUrl(url);
                    updateProfile({ avatar_url: url });
                  }}
                />
              </div>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Fulde navn</Label>
                  <Input
                    id="fullName"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Dit fulde navn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Brugernavn</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Dit brugernavn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Hjemmeside</Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Din hjemmeside"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() =>
                  updateProfile({
                    full_name: fullname,
                    username,
                    website,
                    avatar_url,
                  })
                }
                disabled={loading}
              >
                {loading ? "Opdaterer..." : "Gem ændringer"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lokale indstillinger</CardTitle>
              <CardDescription>
                Tilpas hvordan datoer, tid og valuta vises.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Sprog</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg sprog" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Tidszone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg tidszone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Valuta</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg valuta" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Datoformat</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg datoformat" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_FORMATS.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Tidsformat</Label>
                  <Select value={timeFormat} onValueChange={setTimeFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg tidsformat" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_FORMATS.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() =>
                  updateProfile({
                    timezone,
                    currency,
                    date_format: dateFormat,
                    time_format: timeFormat,
                    language,
                  })
                }
                disabled={loading}
              >
                {loading ? "Opdaterer..." : "Gem ændringer"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifikationsindstillinger</CardTitle>
              <CardDescription>
                Vælg hvilke notifikationer du vil modtage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alle notifikationer</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktiver eller deaktiver alle notifikationer
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => {
                    setNotificationsEnabled(checked);
                    updateProfile({ notifications_enabled: checked });
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email notifikationer</Label>
                  <p className="text-sm text-muted-foreground">
                    Modtag notifikationer via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(checked) => {
                    setEmailNotifications(checked);
                    updateProfile({ email_notifications: checked });
                  }}
                  disabled={!notificationsEnabled}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push notifikationer</Label>
                  <p className="text-sm text-muted-foreground">
                    Modtag push notifikationer
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={(checked) => {
                    setPushNotifications(checked);
                    updateProfile({ push_notifications: checked });
                  }}
                  disabled={!notificationsEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sikkerhedsindstillinger</CardTitle>
              <CardDescription>
                Administrer dine sikkerhedsindstillinger og to-faktor
                autentificering.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>To-faktor autentificering</Label>
                  <p className="text-sm text-muted-foreground">
                    Tilføj et ekstra lag af sikkerhed
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Skift adgangskode</Label>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Nuværende adgangskode"
                    className="max-w-sm"
                  />
                  <Input
                    type="password"
                    placeholder="Ny adgangskode"
                    className="max-w-sm"
                  />
                  <Input
                    type="password"
                    placeholder="Bekræft ny adgangskode"
                    className="max-w-sm"
                  />
                </div>
                <Button className="mt-2">Opdater adgangskode</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Log ud</CardTitle>
              <CardDescription>Log ud af din konto.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action="/auth/signout" method="post">
                <Button variant="destructive" type="submit">
                  Log ud
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
