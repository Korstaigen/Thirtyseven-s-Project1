'use client'

type Props = {
  onClose: () => void
}

export default function LootSystemModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">

      {/* Background click closes */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-gray-900 max-w-3xl w-full max-h-[85vh] rounded-lg shadow-lg overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">
            Loot System – Maximum Effort Raids
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto text-sm leading-relaxed space-y-4 max-h-[70vh]">

          <p>
            Disclaimer: These rules apply only to Maximum Effort raids.
            All other raids remain unchanged.
          </p>

          <p>
            SR+ has been abolished. It is outdated and creates unfair gatekeeping
            through stacked reservations. This slows progression on key items.
            Our main objective is to improve clear times and maintain a high
            performance raid team.
          </p>

          <p>
            You may still soft reserve two items. Some items are hard-reserved
            and listed separately. These follow either priority order or roll
            order depending on item value and player performance.
          </p>

          <p>
            Master Loot will no longer be used except for Kruul and Meph.
            Group Loot is now standard to reduce downtime and improve raid flow.
          </p>

          <p>
            Roll rules: Soft Reserved items roll NEED. Main Spec items roll GREED.
            Off Spec or other items roll PASS.
          </p>

          <p>
            Off Spec is always lowest priority. If everyone passes, the loot
            officer will NEED and conduct a quick roll. Minimal time will be
            spent on loot. Performance always comes first.
          </p>

          <p>
            The official priority list is maintained separately. If your name
            is listed, you are eligible to roll. R means roll between players.
            The greater-than symbol means priority to the first player.
          </p>

          <p>
            To be added to the list, submit desired items. Decisions are based
            on performance and raid-wide benefit, not individual gain.
            Exceptions may be made when necessary.
          </p>

          <p>
            If an item is marked OPEN, notify officers in advance. Otherwise,
            it becomes soft-reservable.
          </p>

          <p>
            These changes are made to improve raid quality, efficiency,
            teamwork, and consistency. We appreciate everyone’s cooperation.
          </p>

        </div>
      </div>
    </div>
  )
}
