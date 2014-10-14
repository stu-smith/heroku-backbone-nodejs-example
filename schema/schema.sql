
CREATE TABLE "user"
(
  "id" serial NOT NULL,
  "email" character varying(200) NOT NULL,
  "passwordHash" character varying(512) NOT NULL,
  "expiry" date NOT NULL,
  CONSTRAINT "pk_user" PRIMARY KEY ("id")
)
WITH (
  OIDS=FALSE
);

--GO--

CREATE INDEX "ix_user_email"
  ON "user"
  USING btree
  ("email");
