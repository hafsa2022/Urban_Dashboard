import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    // phone: "",
    // organization: "",
    // role: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const authUser = session?.user;
        if (!authUser) {
          navigate("/login");
          return;
        }

        if (mounted) {
          const metadata = authUser.user_metadata || {};
          console.log("Loaded user metadata:", metadata);
          setForm({
            email: authUser.email || "",
            full_name: metadata.full_name || "",
            // phone: metadata.phone || "",
            // organization: metadata.organization || "",
            // role: metadata.role || "",
          });
        }
      } catch (err) {
        console.error("Error loading user:", err);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [navigate]);

  const handleChange = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        toast.error("Not authenticated");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: form.full_name,
          // phone: form.phone,
          // organization: form.organization,
          // role: form.role,
        },
      });

      if (error) throw error;
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section class="py-16 my-auto dark:bg-gray-900">
      <div class="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-4">
        <div class="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
          <div class="">
            <h1 class="lg:text-3xl md:text-2xl text-xl font-serif font-extrabold mb-8 dark:text-white ">
              Profile
            </h1>

            <form>
              <div class="w-full rounded-sm bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxob21lfGVufDB8MHx8fDE3MTA0MDE1NDZ8MA&ixlib=rb-4.0.3&q=80&w=1080')] bg-cover bg-center bg-no-repeat items-center">
                <div class="mx-auto flex justify-center w-35.25 h-35.25 bg-blue-300/20 rounded-full bg-[url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxwcm9maWxlfGVufDB8MHx8fDE3MTEwMDM0MjN8MA&ixlib=rb-4.0.3&q=80&w=1080')] bg-cover bg-center bg-no-repeat">
                  <div class="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                    <input
                      type="file"
                      name="profile"
                      id="upload_profile"
                      hidden
                      required
                    />

                    <label for="upload_profile">
                      <svg
                        data-slot="icon"
                        class="w-6 h-5 text-blue-700"
                        fill="none"
                        stroke-width="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        ></path>
                      </svg>
                    </label>
                  </div>
                </div>
                <div class="flex justify-end">
                  <input
                    type="file"
                    name="profile"
                    id="upload_cover"
                    hidden
                    required
                  />

                  <div class="bg-white flex items-center gap-1 rounded-tl-md px-2 text-center font-semibold">
                    <label
                      for="upload_cover"
                      class="inline-flex items-center gap-1 cursor-pointer"
                    >
                      Cover
                      <img
                        src="icons/avatar.jpg"
                        alt="Upload"
                        class="w-4 h-4 mt-1 mx-auto cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div class="flex flex-col lg:flex-row gap-2 justify-center w-full">
                <div class="w-full  mb-4 mt-6">
                  <label for="" class="mb-2 dark:text-gray-300">
                    Fullname
                  </label>
                  <input
                    type="text"
                    class="mt-2 p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                    value={form.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div class="w-full  mb-4 lg:mt-6">
                  <label for="" class=" dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="text"
                    class="mt-2 p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                    placeholder="Email"
                    value={form.email}
                    disabled
                  />
                </div>
              </div>

              <div className="w-full rounded-lg mt-4 text-white text-lg font-semibold flex items-center justify-center gap-2">
                {!editing ? (
                  <Button
                    onClick={() => setEditing(true)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      className="bg-gray-500 hover:bg-gray-600"
                      variant="ghost"
                      onClick={() => {
                        setEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
