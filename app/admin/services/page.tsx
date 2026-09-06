"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Service = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  status: boolean;
  created_at: string;
};

export default function ServicesPage() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("◈");

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("digitalfx_admin") === "true";

    if (!loggedIn) {
      router.replace("/admin/login");
      return;
    }

    loadServices();
  }, [router]);

  async function loadServices() {
    setLoading(true);

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setServices(data || []);
    setLoading(false);
  }

  async function addService() {
    if (!name.trim()) {
      alert("Service name required.");
      return;
    }

    const { error } = await supabase
      .from("services")
      .insert({
        name,
        description,
        icon,
        status: true,
      });

    if (error) {
      console.error(error);
      alert("Unable to add service.");
      return;
    }

    setName("");
    setDescription("");
    setIcon("◈");

    setShowModal(false);

    loadServices();
  }

  async function toggleService(
    id: number,
    status: boolean
  ) {
    const { error } = await supabase
      .from("services")
      .update({
        status: !status,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setServices((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: !status,
            }
          : item
      )
    );
  }

  async function deleteService(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Unable to delete service.");
      return;
    }

    setServices((items) =>
      items.filter((item) => item.id !== id)
    );
  }

  function logout() {
    localStorage.removeItem("digitalfx_admin");
    localStorage.removeItem("digitalfx_remember");

    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#071534]">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 hidden h-screen w-[270px] flex-col bg-[#071534] text-white lg:flex">

        <div className="flex h-[82px] items-center border-b border-white/10 px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
              <img
                src="/logo.png"
                alt="Digital FX"
                className="h-9 w-9 object-contain"
              />
            </div>

            <div>
              <div className="text-xl font-extrabold">
                DIGITAL{" "}
                <span className="text-blue-400">
                  FX
                </span>
              </div>

              <div className="text-[8px] tracking-[2px] text-blue-200/50">
                ADMIN PANEL
              </div>
            </div>

          </div>

        </div>


        <nav className="flex-1 p-4">

          <button
            onClick={() => router.push("/admin")}
            className="mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/60 hover:bg-white/5 hover:text-white"
          >
            <span>▦</span>
            Dashboard
          </button>


          <button
            onClick={() =>
              router.push("/admin/enquiries")
            }
            className="mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/60 hover:bg-white/5 hover:text-white"
          >
            <span>◉</span>
            Enquiries
          </button>


          <button
            className="mb-1 flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
          >
            <span>◇</span>
            Services
          </button>


          <button
            onClick={() =>
              alert("Projects coming next.")
            }
            className="mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/60 hover:bg-white/5 hover:text-white"
          >
            <span>▣</span>
            Projects
          </button>


          <button
            onClick={() =>
              alert("Testimonials coming next.")
            }
            className="mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/60 hover:bg-white/5 hover:text-white"
          >
            <span>★</span>
            Testimonials
          </button>


          <button
            onClick={() =>
              alert("Partners coming next.")
            }
            className="mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/60 hover:bg-white/5 hover:text-white"
          >
            <span>◎</span>
            Partners
          </button>


          <button
            onClick={() =>
              alert("Geo Checker coming next.")
            }
            className="mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/60 hover:bg-white/5 hover:text-white"
          >
            <span>⌖</span>
            Geo Checker
          </button>

        </nav>


        <div className="border-t border-white/10 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
              A
            </div>

            <div className="flex-1">

              <p className="text-sm font-bold">
                Administrator
              </p>

              <p className="text-[10px] text-blue-100/40">
                Super Admin
              </p>

            </div>

            <button
              onClick={logout}
              className="text-blue-100/50 hover:text-white"
            >
              ↪
            </button>

          </div>

        </div>

      </aside>


      {/* MAIN */}

      <div className="lg:ml-[270px]">

        {/* HEADER */}

        <header className="flex h-[82px] items-center justify-between border-b bg-white px-6">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
              Content Management
            </p>

            <h1 className="text-xl font-extrabold">
              Services
            </h1>

          </div>


          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
          >
            + Add Service
          </button>

        </header>


        {/* CONTENT */}

        <div className="p-6 md:p-8">

          <div className="mb-8">

            <h2 className="text-3xl font-extrabold">
              Digital Marketing Services
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage the services displayed on your website.
            </p>

          </div>


          {/* STATS */}

          <div className="mb-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border bg-white p-5 shadow-sm">

              <p className="text-xs font-bold text-gray-400">
                TOTAL SERVICES
              </p>

              <p className="mt-2 text-3xl font-extrabold">
                {services.length}
              </p>

            </div>


            <div className="rounded-2xl border bg-white p-5 shadow-sm">

              <p className="text-xs font-bold text-gray-400">
                ACTIVE
              </p>

              <p className="mt-2 text-3xl font-extrabold text-green-600">
                {
                  services.filter(
                    (item) => item.status
                  ).length
                }
              </p>

            </div>


            <div className="rounded-2xl border bg-white p-5 shadow-sm">

              <p className="text-xs font-bold text-gray-400">
                INACTIVE
              </p>

              <p className="mt-2 text-3xl font-extrabold text-gray-400">
                {
                  services.filter(
                    (item) => !item.status
                  ).length
                }
              </p>

            </div>

          </div>


          {/* SERVICES */}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {loading ? (

              <div className="col-span-full rounded-2xl bg-white p-16 text-center text-gray-400">
                Loading services...
              </div>

            ) : services.length === 0 ? (

              <div className="col-span-full rounded-2xl border-2 border-dashed bg-white p-16 text-center">

                <div className="text-4xl">
                  ◇
                </div>

                <h3 className="mt-4 font-extrabold">
                  No Services Yet
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  Add your first Digital FX service.
                </p>

                <button
                  onClick={() =>
                    setShowModal(true)
                  }
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
                >
                  + Add First Service
                </button>

              </div>

            ) : (

              services.map((service) => (

                <div
                  key={service.id}
                  className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                      {service.icon || "◈"}
                    </div>


                    <button
                      onClick={() =>
                        toggleService(
                          service.id,
                          service.status
                        )
                      }
                      className={`relative h-6 w-11 rounded-full transition ${
                        service.status
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >

                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                          service.status
                            ? "left-6"
                            : "left-1"
                        }`}
                      />

                    </button>

                  </div>


                  <h3 className="mt-5 text-lg font-extrabold">
                    {service.name}
                  </h3>


                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                    {service.description ||
                      "No description added."}
                  </p>


                  <div className="mt-5 flex items-center justify-between border-t pt-4">

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                        service.status
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {service.status
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </span>


                    <button
                      onClick={() =>
                        deleteService(service.id)
                      }
                      className="rounded-lg px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>


      {/* ADD SERVICE MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b p-6">

              <div>

                <p className="text-xs font-bold text-blue-600">
                  SERVICE MANAGEMENT
                </p>

                <h3 className="mt-1 text-xl font-extrabold">
                  Add New Service
                </h3>

              </div>


              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-lg"
              >
                ×
              </button>

            </div>


            <div className="space-y-5 p-6">

              <div>

                <label className="text-xs font-bold text-gray-500">
                  Service Name
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="SEO Services"
                  className="mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

              </div>


              <div>

                <label className="text-xs font-bold text-gray-500">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe this service..."
                  rows={4}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

              </div>


              <div>

                <label className="text-xs font-bold text-gray-500">
                  Icon
                </label>

                <input
                  value={icon}
                  onChange={(e) =>
                    setIcon(e.target.value)
                  }
                  placeholder="◈"
                  className="mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none focus:border-blue-500"
                />

              </div>

            </div>


            <div className="flex gap-3 border-t bg-gray-50 p-6">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="flex-1 rounded-xl border bg-white py-3 text-sm font-bold"
              >
                Cancel
              </button>


              <button
                onClick={addService}
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white"
              >
                Add Service
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}