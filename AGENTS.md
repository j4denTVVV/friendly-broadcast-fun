<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the shared-password admin session as the sole gate for privileged server functions; the control-room effects are presentation only, not access control.
- Store ordered banner messages and their animations in `site_banner.messages` while retaining `message` and `link` as first-item compatibility fields; existing readers and data stay intact.
- Build public roster slots and creator channels through the same per-visitor unsealing filter, so sealed identities do not appear in visible pages before search.

- The control room uses the shared public tokens, with the shared `--signal` accent as its highlight colour; why: one theme source, no admin-only palette.
- Route top-navigation clicks through the shared gate transition before client navigation; why: the visual transition remains consistent across pages without changing access controls.
