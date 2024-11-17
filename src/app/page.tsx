"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, Globe, Map, Ticket } from "lucide-react";
import heroImg from "../assets/hero.jpg";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Component() {
  const { user } = useUser();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full px-4 lg:px-6 h-14 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center justify-center">
          <span className="font-semibold text-lg">TravelPortal</span>
        </Link>

        <div className="flex gap-4">
          {user ? (
            <Link
              href="/user/dashboard"
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/signin"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Login
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full">
          <div className="relative">
            <Image
              src={heroImg}
              alt="Beautiful European city street with classic architecture and tram lines"
              width={1920}
              height={1080}
              className="w-full h-[calc(100vh-3.5rem)] object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20">
              <div className="container mx-auto h-full flex flex-col items-center justify-center text-center gap-4 px-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-white">
                  Discover Beautiful Destinations
                </h1>
                <p className="max-w-[600px] text-white/90 md:text-xl">
                  Experience the charm of this Beautiful World and create
                  unforgettable memories with us
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Why Choose TravelPortal?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <Globe className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>Global Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Explore a wide range of destinations across the globe, from
                    bustling cities to serene beaches.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Ticket className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>Easy Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Book your flights, hotels, and activities with just a few
                    clicks. Hassle-free planning for your dream vacation.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Map className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>Personalized Itineraries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Create custom travel plans tailored to your preferences and
                    interests. Your journey, your way.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Compass className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our dedicated support team is available round the clock to
                    assist you with any queries or concerns.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 bg-gray-100">
        <div className="container flex justify-center text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TravelPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
