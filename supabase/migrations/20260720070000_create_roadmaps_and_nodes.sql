CREATE TABLE roadmaps (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users (id),
    title       TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE nodes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id  UUID NOT NULL REFERENCES roadmaps (id) ON DELETE CASCADE,
    parent_id   UUID REFERENCES nodes (id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX nodes_roadmap_id_idx ON nodes (roadmap_id);
CREATE INDEX nodes_parent_id_idx ON nodes (parent_id);
