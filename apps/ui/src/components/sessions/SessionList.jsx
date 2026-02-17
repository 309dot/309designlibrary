import React, { useEffect, useMemo, useRef, useState } from "react";

export default function SessionList({
  projects,
  selectedProjectId,
  activeId,
  onSelect,
  onSelectProject,
  onAddProject,
  onRenameProject,
  onDeleteProject,
  onNewChat,
  onMoveSession,
  onDelete,
  onClose
}) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [projectType, setProjectType] = useState("path");
  const [projectValue, setProjectValue] = useState("");
  const [projectName, setProjectName] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [moveOpenFor, setMoveOpenFor] = useState(null);
  const [projectMenuOpenFor, setProjectMenuOpenFor] = useState(null);
  const [renameProjectId, setRenameProjectId] = useState(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [collapsedProjectIds, setCollapsedProjectIds] = useState(() => new Set());
  const menuWrapRef = useRef(null);

  const allProjects = Array.isArray(projects) ? projects : [];
  const selectedProject =
    allProjects.find((project) => project.id === selectedProjectId) ?? allProjects[0] ?? null;

  const moveTargetsBySession = useMemo(() => {
    const mapping = new Map();
    for (const project of allProjects) {
      const sessions = Array.isArray(project.sessions) ? project.sessions : [];
      for (const session of sessions) {
        const targets = allProjects.filter((item) => item.id !== project.id);
        mapping.set(session.id, targets);
      }
    }
    return mapping;
  }, [allProjects]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!menuWrapRef.current) return;
      if (!menuWrapRef.current.contains(event.target)) {
        setMenuOpenFor(null);
        setMoveOpenFor(null);
        setProjectMenuOpenFor(null);
      }
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  const resetComposer = () => {
    setProjectType("path");
    setProjectValue("");
    setProjectName("");
  };

  const submitProject = () => {
    const value = String(projectValue ?? "").trim();
    if (!value) return;
    onAddProject?.({
      type: projectType,
      value,
      name: String(projectName ?? "").trim()
    });
    setComposerOpen(false);
    resetComposer();
  };

  const toggleProjectCollapse = (projectId) => {
    setCollapsedProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  const startRenameProject = (project) => {
    if (!project || project.id === "default") return;
    setRenameProjectId(project.id);
    setRenameDraft(String(project.name ?? ""));
  };

  const cancelRenameProject = () => {
    setRenameProjectId(null);
    setRenameDraft("");
  };

  const submitRenameProject = (projectId) => {
    const nextName = String(renameDraft ?? "").trim();
    if (!nextName) return;
    onRenameProject?.(projectId, nextName);
    cancelRenameProject();
  };

  return (
    <div className="session-list">
      <div className="threads-header">
        <div className="threads-title">Projects</div>
        <div className="threads-actions">
          <button
            className="ghost icon-button"
            onClick={() => setComposerOpen((prev) => !prev)}
            title="프로젝트 추가"
            type="button"
          >
            📁
          </button>
          <button
            className="ghost icon-button"
            onClick={() => onNewChat?.(selectedProject)}
            title="새 세션"
            type="button"
          >
            ＋
          </button>
          <button
            className="ghost icon-button"
            onClick={() => onClose?.()}
            title="Threads 닫기"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>

      {composerOpen ? (
        <div className="project-composer">
          <div className="project-composer-row">
            <select
              value={projectType}
              onChange={(event) => setProjectType(event.target.value === "git" ? "git" : "path")}
            >
              <option value="path">폴더 경로</option>
              <option value="git">Git</option>
            </select>
          </div>
          <div className="project-composer-row">
            <input
              value={projectValue}
              onChange={(event) => setProjectValue(event.target.value)}
              placeholder={projectType === "git" ? "owner/repo 또는 remote URL" : "/Users/.../project"}
            />
          </div>
          <div className="project-composer-row">
            <input
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="표시 이름(선택)"
            />
          </div>
          <div className="project-composer-actions">
            <button className="ghost" type="button" onClick={() => setComposerOpen(false)}>
              취소
            </button>
            <button className="primary" type="button" onClick={submitProject}>
              추가
            </button>
          </div>
        </div>
      ) : null}

      <div className="threads-list" ref={menuWrapRef}>
        {allProjects.length === 0 ? <div className="empty">프로젝트가 없습니다.</div> : null}
        {allProjects.map((project) => {
          const sessions = Array.isArray(project.sessions) ? project.sessions : [];
          const selected = project.id === selectedProject?.id;
          const collapsed = collapsedProjectIds.has(project.id);
          const canEditProject = project.id !== "default";
          return (
            <div key={project.id} className={`project-section ${selected ? "active" : ""}`}>
              <div className="project-section-header">
                <button
                  type="button"
                  className="ghost icon-button project-collapse"
                  title={collapsed ? "펼치기" : "접기"}
                  onClick={() => toggleProjectCollapse(project.id)}
                >
                  {collapsed ? "▸" : "▾"}
                </button>
                {renameProjectId === project.id ? (
                  <div className="project-rename-inline">
                    <input
                      value={renameDraft}
                      onChange={(event) => setRenameDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") submitRenameProject(project.id);
                        if (event.key === "Escape") cancelRenameProject();
                      }}
                      autoFocus
                    />
                    <button
                      className="ghost icon-button project-rename-btn"
                      type="button"
                      title="저장"
                      onClick={() => submitRenameProject(project.id)}
                    >
                      ✓
                    </button>
                    <button
                      className="ghost icon-button project-rename-btn"
                      type="button"
                      title="취소"
                      onClick={cancelRenameProject}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="project-section-main"
                    onClick={() => onSelectProject?.(project.id)}
                    title={`${project.name} (${project.type})`}
                  >
                    <span className="project-chip-name">{project.name}</span>
                    <span className="project-chip-count">{sessions.length}</span>
                  </button>
                )}
                <button
                  className="ghost icon-button project-more"
                  title="프로젝트 메뉴"
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setProjectMenuOpenFor((prev) => (prev === project.id ? null : project.id));
                  }}
                >
                  ⋯
                </button>
                {projectMenuOpenFor === project.id ? (
                  <div className="thread-row-menu project-row-menu" role="menu">
                    <button
                      className="menu-button"
                      type="button"
                      disabled={!canEditProject}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        startRenameProject(project);
                        setProjectMenuOpenFor(null);
                      }}
                    >
                      이름 변경
                    </button>
                    <button
                      className="menu-button danger"
                      type="button"
                      disabled={!canEditProject}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onDeleteProject?.(project.id);
                        setProjectMenuOpenFor(null);
                      }}
                    >
                      프로젝트 삭제
                    </button>
                  </div>
                ) : null}
              </div>

              {!collapsed ? (
                <div className="project-section-body">
                  {sessions.length === 0 ? (
                    <div className="empty">세션이 없습니다.</div>
                  ) : null}
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`thread-row ${activeId === session.id ? "active" : ""}`}
                    >
                      <button
                        className="thread-main"
                        onClick={() => {
                          onSelectProject?.(project.id);
                          onSelect?.(session.id);
                        }}
                        title={session.title || session.id}
                        type="button"
                      >
                        <span className="thread-title">{session.title || "New chat"}</span>
                      </button>
                      <button
                        className="ghost icon-button thread-more"
                        title="더보기"
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setMoveOpenFor(null);
                          setMenuOpenFor((prev) => (prev === session.id ? null : session.id));
                        }}
                      >
                        ⋯
                      </button>
                      {menuOpenFor === session.id ? (
                        <div className="thread-row-menu" role="menu">
                          <button
                            className="menu-button"
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setMoveOpenFor((prev) => (prev === session.id ? null : session.id));
                            }}
                          >
                            프로젝트 이동
                          </button>
                          {moveOpenFor === session.id ? (
                            <div className="thread-row-submenu">
                              {(moveTargetsBySession.get(session.id) ?? []).map((target) => (
                                <button
                                  key={`${session.id}-${target.id}`}
                                  className="menu-button"
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setMenuOpenFor(null);
                                    setMoveOpenFor(null);
                                    onMoveSession?.(session.id, target);
                                  }}
                                >
                                  {target.name}
                                </button>
                              ))}
                              {(moveTargetsBySession.get(session.id) ?? []).length === 0 ? (
                                <div className="menu-help">이동 가능한 프로젝트가 없습니다.</div>
                              ) : null}
                            </div>
                          ) : null}
                          <button
                            className="menu-button danger"
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setMenuOpenFor(null);
                              setMoveOpenFor(null);
                              onDelete?.(session.id);
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
