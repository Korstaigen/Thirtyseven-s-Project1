'use client'

import { useEffect, useState } from 'react'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('loot_rules_accepted')

    if (!accepted) {
      setShowModal(true)
    }
  }, [])

  function closeModal() {
    localStorage.setItem('loot_rules_accepted', 'true')
    setShowModal(false)
  }

  return (
    <>
      {children}

      {/* Loot System Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

          <div className="bg-gray-900 text-white max-w-lg w-full p-6 rounded-lg shadow-xl border border-gray-700">

            <h2 className="text-xl font-bold mb-4 text-center">
              Loot System
            </h2>

            <div className="text-sm space-y-3 text-gray-300 text-center">

              <p>
                This only applies to <b>Maximum Effort</b> raids.
                All other raids remain unchanged.
              </p>

              <p>
                SR+ has been removed. The system encouraged stacking
                and blocked progression.
              </p>

              <p>
                Players may SR two items. Some items are hard-reserved.
              </p>

              <p>
                Master loot is only used on Kruul and Mephistroth.
              </p>

              <p>
                Group loot is standard to improve raid speed.
              </p>

              <p>
                SR item: NEED. MS item: GREED. OS: PASS.
              </p>

              <p>
                Priority lists determine eligibility.
              </p>

              <p>
                Decisions are made for raid benefit.
              </p>

              <p className="font-semibold text-gray-200">
                The goal is performance and consistency.
              </p>

            </div>

            <div className="mt-6 flex justify-center">

              <button
                onClick={closeModal}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded font-semibold"
              >
                OK
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Footer Credit */}
      <div className="fixed bottom-2 right-3 text-xs text-gray-500 opacity-70 select-none pointer-events-none">
        Built by Thirtyseven
      </div>
    </>
  )
}
