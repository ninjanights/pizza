import React from "react";

export default function PublicProcess({ className }: { className?: string }) {
  return (
    <div className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section
          aria-labelledby="project-process-heading"
          className={`rounded-2xl border border-neutral-200 bg-transparent p-5 text-neutral-700 sm:p-7 ${className ?? ""}`}
        >
          <h2 id="project-process-heading" className="mb-6 text-2xl font-black tracking-tight text-zinc-900">
            Process Overview
          </h2>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="sm:flex-1">
              <h3 className="text-base font-bold text-neutral-700">Backend Process</h3>
              <ol className="mt-3 list-decimal list-inside space-y-2 text-sm font-semibold leading-6 text-neutral-600">
                <li>
                  <span className="font-black text-neutral-900">Built Express, Prisma connection</span> and generated the database schema for order status,
                  sessions, menu items, inventory, admin and store settings for automatic order processing.
                </li>
                <li><span className="font-black text-neutral-900">Validated the schema</span>, connected it with Neon and ran the migrations.</li>
                <li><span className="font-black text-neutral-900">Created seed data</span> for the cafe menu items and admin credentials and populated the database.</li>
                <li>
                  <span className="font-black text-neutral-900">Built services for cookie-based session authentication and customer order checkout</span>. Anything
                  that talks to the database happens inside the service layer.
                </li>
                <li><span className="font-black text-neutral-900">Controllers use those services</span> and are connected through routes.</li>
                <li><span className="font-black text-neutral-900">Added requireAdmin and requireSession middleware</span> to filter requests based on cookies.</li>
                <li>
                  <span className="font-black text-neutral-900">Added order validation</span> by checking inventory dynamically, with order creation and inventory
                  changes handled atomically.
                </li>
                <li><span className="font-black text-neutral-900">Created a separate dashboard route</span> that sends filtered, grouped and calculated data for admins.</li>
                <li>
                  <span className="font-black text-neutral-900">Added a store setting</span> that can be turned on/off to automatically process orders from received
                  → preparing → out for delivery → delivered.
                </li>
                <li><span className="font-black text-neutral-900">Customer sessions last 24 hours</span> and their expiry is refreshed whenever they place a new order.</li>
                <li><span className="font-black text-neutral-900">Added a cron job</span> to automatically refill inventory when an item drops below the defined stock level.</li>
                <li><span className="font-black text-neutral-900">Coming up</span>: Socket connection for real-time order updates and notifications.</li>
              </ol>
            </div>

            <div className="hidden self-stretch w-px bg-neutral-400 sm:block" aria-hidden="true" />

            <div className="sm:flex-1">
              <h3 className="text-base font-bold text-neutral-700">Frontend Process</h3>
              <ol className="mt-3 list-decimal list-inside space-y-2 text-sm font-semibold leading-6 text-neutral-600">
                <li><span className="font-black text-neutral-900">Added protected/admin-only routes</span>, public routes and session-protected customer routes.</li>
                <li><span className="font-black text-neutral-900">Used useReducer and useContext</span> to manage and keep the cart state.</li>
                <li>
                  <span className="font-black text-neutral-900">Customer and admin sessions use separate cookies</span>, so both can stay logged in independently in
                  the same browser or mobile device.
                </li>
                <li>
                  <span className="font-black text-neutral-900">Admin can manually update an order's status</span> or turn on automatic processing and let the backend
                  handle it in the background.
                </li>
                <li>
                  <span className="font-black text-neutral-900">When a customer visits</span>, the frontend asks the backend for a session. If an existing session is
                  found, it continues with it; otherwise, a new session is created and given to the browser.
                </li>
              </ol>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-600">
                <span>we&apos;re up with</span>
                <span className="h-4 w-px bg-neutral-400" aria-hidden="true" />
                <span>Render</span>
                <span className="text-neutral-500">•</span>
                <span>Vercel</span>
                <span className="text-neutral-500">•</span>
                <span>PostgreSQL with Neon</span>
                <span className="h-4 w-px bg-neutral-400" aria-hidden="true" />
                <a
                  href="https://github.com/ninjanights/pizza"
                  target="_blank"
                  rel="noreferrer"
                  className="lowercase text-neutral-700 hover:text-[#ED7B7B]"
                >
                  github.com/ninjanights/pizza
                </a>
                <span className="text-neutral-500">•</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
