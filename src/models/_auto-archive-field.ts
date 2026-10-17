/**
 * Auto-archive: finished items leave their board this long after they close.
 * Archived is the record's `state` (ModelState.archived), not a status — the
 * outcome and history stay and the item can be restored; anyone can archive
 * sooner from the board. One shape for every board that archives: workflow
 * tasks (workflow definition) and leads (lead pipeline settings).
 */
export const AutoArchiveField = (notes: string, extra: { group?: string } = {}) =>
  ({
    autoArchive: {
      type: 'object',
      title: 'Auto-archive',
      notes,
      ...extra,
      properties: {
        enabled: { type: 'boolean', default: true },
        after: { type: 'number', default: 7, minimum: 0 },
        units: { type: 'string', enum: ['hours', 'days'], default: 'days' },
      },
    },
  }) as const;
