import React, {
  Fragment,
  useState,
  useRef,
  useMemo,
  MutableRefObject,
} from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import ReactQuill, { ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const videoOptions = [{ id: 1, name: "YouTube" }];

const socialOptions = [{ id: 1, name: "Facebook" }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function App() {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [openSocialModal, setOpenSocialModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(videoOptions[0]);
  const [selectedSocial, setSelectedSocial] = useState(socialOptions[0]);

  const [uploadedFile, setUploadedFile] = useState<string>();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  const [videoUrl, setVideoUrl] = useState<string>("");

  const [socialUrl, setSocialUrl] = useState<string>();
  const [, setSocialCode] = useState<string>();

  const uploadOptions = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#000"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
      title: "Picture",
      description: "Jpeng, png",
      onClick: () => {
        setOpenModal(false);
        setOpenImageModal(true);
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#000"
          className="w-6 h-6"
        >
          <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
        </svg>
      ),
      title: "Video",
      description: "Embed a YouTube video",
      onClick: () => {
        setOpenVideoModal(true);
        setOpenModal(false);
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#000"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
            clipRule="evenodd"
          />
        </svg>
      ),
      title: "Social",
      description: "Embed a Facebook link",
      onClick: () => {
        setOpenSocialModal(true);
        setOpenModal(false);
      },
    },
  ];

  const quillRef = useRef<any>();

  const handleOpenImageModal = () => setOpenImageModal(true);

  const handleOpenVideoModal = () => setOpenVideoModal(true);

  const uploadImage = async () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file: any = input && input.files ? input.files[0] : null;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ky3ucawo");

      setImageUploadError(false);
      setImageUploadLoading(true);
      await axios
        .post("https://api.cloudinary.com/v1_1/vokenad/image/upload", formData)
        .then(({ data }) => {
          setUploadedFile(data.secure_url);
        })
        .catch((err) => setImageUploadError(true))
        .finally(() => setImageUploadLoading(false));
    };
  };

  const customImageHandler = async () => {
    if (!uploadedFile) return;

    let quillObj = quillRef.current.getEditor();

    const range = quillObj.getSelection();
    quillObj.editor.insertEmbed(range, "image", uploadedFile);

    setOpenImageModal(false);
    setUploadedFile("");
  };

  const videoHandler = () => {
    let url = getVideoUrl(videoUrl);
    let quillObj = quillRef.current.getEditor();
    let range = quillObj.getSelection();
    if (url != null) {
      quillObj.insertEmbed(range, "video", url);
      setOpenVideoModal(false);
    }
  };

  const getVideoUrl = (url: string) => {
    let match =
      url.match(
        /^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/
      ) ||
      url.match(
        /^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/
      ) ||
      url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);

    if (match && match[2].length === 11) {
      return "https://www.youtube.com/embed/" + match[2] + "?showinfo=0";
    }

    return null;
  };

  const socialHandler = () => {
    if (!socialUrl) return;

    let quillObj = quillRef.current.getEditor();
    let range = quillObj.getSelection();
    if (socialUrl != null) {
      quillObj.insertEmbed(range, "video", socialUrl);
      setOpenSocialModal(false);
    }
  };

  const editorModules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["link", "image", "video"],
          [
            { align: "" },
            { align: "center" },
            { align: "right" },
            { align: "justify" },
          ],
          ["bold", "italic", "blockquote", "code"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        handlers: {
          image: handleOpenImageModal,
          video: handleOpenVideoModal,
        },
      },
    };
  }, []);

  return (
    <div className="w-4/5 mx-auto mt-48">
      <div className="border p-5" />
      <div className="border p-4">
        <div className="">
          <input
            className="w-full text-2xl text-black font-semibold outline-none"
            placeholder="Add post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>
      <ReactQuill
        theme="snow"
        placeholder="Add content"
        value={value}
        onChange={setValue}
        className="h-96"
        ref={quillRef}
        modules={editorModules}
      />
      <div className="relative -mt-10 ml-5 z-10">
        <div
          className="h-10 w-10 rounded-full bg_primary flex justify-center items-center cursor-pointer"
          onClick={() => setOpenModal(!openModal)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#000"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {openModal && (
          <div className="w-1/5 mt-2 bg-white py-3 rounded-xl shadow">
            <p className="ml-4 text-sm uppercase">Embeds</p>
            {uploadOptions?.map((upload, i) => (
              <div
                key={i}
                className="my-3 hover:bg-emerald-50 p-2 flex flex-row cursor-pointer"
                onClick={upload.onClick}
              >
                <div className="mr-3">{upload.icon}</div>
                <div className="-mt-1">
                  <p className="text-base text-dark font-semibold">
                    {upload.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {upload.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Transition.Root show={openImageModal} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={setOpenImageModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 outline-none"
                      onClick={() => setOpenImageModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Embed
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-base text-gray-500">Upload Image</p>
                      </div>
                      <div className="mt-5">
                        <p className="text-sm text-gray-400 uppercase">
                          File Upload
                        </p>
                        <div className="mt-3 border border-dashed outline_button_primary rounded-lg h-44 w-full flex flex-col justify-center items-center">
                          {imageUploadLoading && (
                            <svg
                              className="mb-3 animate-spin text-white h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-75"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#097227"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          )}

                          {uploadedFile ? (
                            <img
                              src={uploadedFile}
                              alt=" upload"
                              className="w-24 h-24 rounded-full"
                            />
                          ) : (
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md border outline_button_primary bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none sm:mt-0 sm:w-auto sm:text-sm"
                              onClick={() => uploadImage()}
                            >
                              Import Image from Device
                            </button>
                          )}

                          {imageUploadError && (
                            <p className="mt-5 text-red-700 text-sm text-center">
                              Image upload failed
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row">
                    <button
                      type="button"
                      className="mr-3 inline-flex w-full justify-center rounded-md border border-transparent button_primary px-4 py-2 text-base font-medium text-white shadow-sm outline-none sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                      onClick={() => customImageHandler()}
                    >
                      Embed
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border cancel_button bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm outline-none sm:mt-0 sm:w-auto sm:text-sm  cursor-pointer"
                      onClick={() => setOpenImageModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Video Modal */}
      <Transition.Root show={openVideoModal} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={setOpenVideoModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 outline-none"
                      onClick={() => setOpenVideoModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Embed
                      </Dialog.Title>
                      <div className="mt-5">
                        <div className="mb-5">
                          <Listbox
                            value={selectedVideo}
                            onChange={setSelectedVideo}
                          >
                            {({ open }) => (
                              <>
                                <Listbox.Label className="block text-sm text-gray-400 uppercase">
                                  Video Provider
                                </Listbox.Label>
                                <div className="relative mt-1">
                                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-neutral-50 py-2 pl-3 pr-10 text-left shadow-sm outline-none sm:text-sm">
                                    <span className="block truncate">
                                      {selectedVideo.name}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  </Listbox.Button>

                                  <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {videoOptions.map((option) => (
                                        <Listbox.Option
                                          key={option.id}
                                          className={({ active }) =>
                                            classNames(
                                              active
                                                ? "text-white bg-indigo-600"
                                                : "text-gray-900",
                                              "relative cursor-default select-none py-2 pl-3 pr-9"
                                            )
                                          }
                                          value={option}
                                        >
                                          {({ selected, active }) => (
                                            <>
                                              <span
                                                className={classNames(
                                                  selected
                                                    ? "font-semibold"
                                                    : "font-normal",
                                                  "block truncate"
                                                )}
                                              >
                                                {option.name}
                                              </span>

                                              {selected ? (
                                                <span
                                                  className={classNames(
                                                    active
                                                      ? "text-white"
                                                      : "text-indigo-600",
                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                  )}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="w-5 h-5"
                                                  >
                                                    <path
                                                      fillRule="evenodd"
                                                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                                      clipRule="evenodd"
                                                    />
                                                  </svg>
                                                </span>
                                              ) : null}
                                            </>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </>
                            )}
                          </Listbox>
                        </div>
                        <div>
                          <label
                            htmlFor="videoUrl"
                            className="block text-sm text-gray-400 uppercase"
                          >
                            URL
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="videoUrl"
                              id="videoUrl"
                              className="block w-full bg-neutral-50 p-3 border outline-none rounded-md shadow-sm sm:text-sm"
                              placeholder="https://"
                              onChange={(e) => setVideoUrl(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row">
                    <button
                      type="button"
                      className="mr-3 inline-flex w-full justify-center rounded-md border border-transparent button_primary px-4 py-2 text-base font-medium text-white shadow-sm outline-none sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                      onClick={() => videoHandler()}
                    >
                      Embed
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border cancel_button bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm outline-none sm:mt-0 sm:w-auto sm:text-sm cursor-pointer"
                      onClick={() => setOpenVideoModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Social Modal */}
      <Transition.Root show={openSocialModal} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={setOpenSocialModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 outline-none"
                      onClick={() => setOpenSocialModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Embed
                      </Dialog.Title>

                      <div className="mt-5">
                        <div className="mb-5">
                          <Listbox
                            value={selectedSocial}
                            onChange={setSelectedSocial}
                          >
                            {({ open }) => (
                              <>
                                <Listbox.Label className="block text-sm text-gray-400 uppercase">
                                  Social Media Platform
                                </Listbox.Label>
                                <div className="relative mt-1">
                                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-neutral-50 py-2 pl-3 pr-10 text-left shadow-sm outline-none sm:text-sm">
                                    <span className="block truncate">
                                      {selectedSocial.name}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  </Listbox.Button>

                                  <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {socialOptions.map((option) => (
                                        <Listbox.Option
                                          key={option.id}
                                          className={({ active }) =>
                                            classNames(
                                              active
                                                ? "text-white bg-indigo-600"
                                                : "text-gray-900",
                                              "relative cursor-default select-none py-2 pl-3 pr-9"
                                            )
                                          }
                                          value={option}
                                        >
                                          {({ selected, active }) => (
                                            <>
                                              <span
                                                className={classNames(
                                                  selected
                                                    ? "font-semibold"
                                                    : "font-normal",
                                                  "block truncate"
                                                )}
                                              >
                                                {option.name}
                                              </span>

                                              {selected ? (
                                                <span
                                                  className={classNames(
                                                    active
                                                      ? "text-white"
                                                      : "text-indigo-600",
                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                  )}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="w-5 h-5"
                                                  >
                                                    <path
                                                      fillRule="evenodd"
                                                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                                      clipRule="evenodd"
                                                    />
                                                  </svg>
                                                </span>
                                              ) : null}
                                            </>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </>
                            )}
                          </Listbox>
                        </div>
                        <div className="mb-5">
                          <label
                            htmlFor="socialUrl"
                            className="block text-sm text-gray-400"
                          >
                            URL
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="socialUrl"
                              className="block w-full bg-neutral-50 p-3 border outline-none rounded-md shadow-sm sm:text-sm"
                              placeholder="https://"
                              onChange={(e) => setSocialUrl(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="socialCode"
                            className="block text-sm text-gray-400"
                          >
                            Code
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="socialCode"
                              className="block w-full bg-neutral-50 p-3 border outline-none rounded-md shadow-sm sm:text-sm"
                              placeholder="<iframe "
                              onChange={(e) => setSocialCode(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-row justify-between">
                        <p className="text-base text-gray-400">
                          Disable caption
                        </p>
                        <div>
                          <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row">
                    <button
                      type="button"
                      className="mr-3 inline-flex w-full justify-center rounded-md border border-transparent button_primary px-4 py-2 text-base font-medium text-white shadow-sm outline-none sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                      onClick={() => socialHandler()}
                    >
                      Embed
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border cancel_button bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm outline-none sm:mt-0 sm:w-auto sm:text-sm cursor-pointer"
                      onClick={() => setOpenSocialModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default App;
