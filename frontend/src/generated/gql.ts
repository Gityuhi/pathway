/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CatchUpDailyLogs {\n    catchUpDailyLogs\n  }\n": typeof types.CatchUpDailyLogsDocument,
    "\n  query DailyLogs($from: String!, $to: String!) {\n    dailyLogs(from: $from, to: $to) {\n      date\n      isCompleted\n    }\n  }\n": typeof types.DailyLogsDocument,
    "\n  mutation CreateRoadmap($input: NewRoadmap!) {\n    createRoadmap(input: $input) {\n      id\n      title\n      createdAt\n    }\n  }\n": typeof types.CreateRoadmapDocument,
    "\n  query RoadmapNodes($roadmapId: ID!) {\n    roadmapNodes(roadmapId: $roadmapId) {\n      id\n      roadmapId\n      parentId\n      title\n    }\n  }\n": typeof types.RoadmapNodesDocument,
    "\n  query Roadmaps {\n    roadmaps {\n      id\n      title\n      createdAt\n    }\n  }\n": typeof types.RoadmapsDocument,
    "\n  mutation CreateTodo($input: NewTodo!) {\n    createTodo(input: $input) {\n      id\n      text\n      status\n      user {\n        id\n        name\n      }\n    }\n  }\n": typeof types.CreateTodoDocument,
    "\n  query Todos {\n    todos {\n      id\n      text\n      status\n      user {\n        id\n        name\n      }\n    }\n  }\n": typeof types.TodosDocument,
    "\n  mutation UpdateTodo($id: ID!, $input: UpdateTodo!) {\n    updateTodo(id: $id, input: $input) {\n      id\n      text\n      status\n    }\n  }\n": typeof types.UpdateTodoDocument,
    "\n  mutation UpdateTodoStatus($id: ID!, $input: UpdateTodoStatus!) {\n    updateTodoStatus(id: $id, input: $input) {\n      id\n      text\n      status\n    }\n  }\n": typeof types.UpdateTodoStatusDocument,
    "\n  mutation DeleteTodo($id: ID!) {\n    deleteTodo(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteTodoDocument,
};
const documents: Documents = {
    "\n  mutation CatchUpDailyLogs {\n    catchUpDailyLogs\n  }\n": types.CatchUpDailyLogsDocument,
    "\n  query DailyLogs($from: String!, $to: String!) {\n    dailyLogs(from: $from, to: $to) {\n      date\n      isCompleted\n    }\n  }\n": types.DailyLogsDocument,
    "\n  mutation CreateRoadmap($input: NewRoadmap!) {\n    createRoadmap(input: $input) {\n      id\n      title\n      createdAt\n    }\n  }\n": types.CreateRoadmapDocument,
    "\n  query RoadmapNodes($roadmapId: ID!) {\n    roadmapNodes(roadmapId: $roadmapId) {\n      id\n      roadmapId\n      parentId\n      title\n    }\n  }\n": types.RoadmapNodesDocument,
    "\n  query Roadmaps {\n    roadmaps {\n      id\n      title\n      createdAt\n    }\n  }\n": types.RoadmapsDocument,
    "\n  mutation CreateTodo($input: NewTodo!) {\n    createTodo(input: $input) {\n      id\n      text\n      status\n      user {\n        id\n        name\n      }\n    }\n  }\n": types.CreateTodoDocument,
    "\n  query Todos {\n    todos {\n      id\n      text\n      status\n      user {\n        id\n        name\n      }\n    }\n  }\n": types.TodosDocument,
    "\n  mutation UpdateTodo($id: ID!, $input: UpdateTodo!) {\n    updateTodo(id: $id, input: $input) {\n      id\n      text\n      status\n    }\n  }\n": types.UpdateTodoDocument,
    "\n  mutation UpdateTodoStatus($id: ID!, $input: UpdateTodoStatus!) {\n    updateTodoStatus(id: $id, input: $input) {\n      id\n      text\n      status\n    }\n  }\n": types.UpdateTodoStatusDocument,
    "\n  mutation DeleteTodo($id: ID!) {\n    deleteTodo(id: $id) {\n      id\n    }\n  }\n": types.DeleteTodoDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CatchUpDailyLogs {\n    catchUpDailyLogs\n  }\n"): (typeof documents)["\n  mutation CatchUpDailyLogs {\n    catchUpDailyLogs\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DailyLogs($from: String!, $to: String!) {\n    dailyLogs(from: $from, to: $to) {\n      date\n      isCompleted\n    }\n  }\n"): (typeof documents)["\n  query DailyLogs($from: String!, $to: String!) {\n    dailyLogs(from: $from, to: $to) {\n      date\n      isCompleted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateRoadmap($input: NewRoadmap!) {\n    createRoadmap(input: $input) {\n      id\n      title\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRoadmap($input: NewRoadmap!) {\n    createRoadmap(input: $input) {\n      id\n      title\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RoadmapNodes($roadmapId: ID!) {\n    roadmapNodes(roadmapId: $roadmapId) {\n      id\n      roadmapId\n      parentId\n      title\n    }\n  }\n"): (typeof documents)["\n  query RoadmapNodes($roadmapId: ID!) {\n    roadmapNodes(roadmapId: $roadmapId) {\n      id\n      roadmapId\n      parentId\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Roadmaps {\n    roadmaps {\n      id\n      title\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query Roadmaps {\n    roadmaps {\n      id\n      title\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTodo($input: NewTodo!) {\n    createTodo(input: $input) {\n      id\n      text\n      status\n      user {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTodo($input: NewTodo!) {\n    createTodo(input: $input) {\n      id\n      text\n      status\n      user {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Todos {\n    todos {\n      id\n      text\n      status\n      user {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query Todos {\n    todos {\n      id\n      text\n      status\n      user {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTodo($id: ID!, $input: UpdateTodo!) {\n    updateTodo(id: $id, input: $input) {\n      id\n      text\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTodo($id: ID!, $input: UpdateTodo!) {\n    updateTodo(id: $id, input: $input) {\n      id\n      text\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTodoStatus($id: ID!, $input: UpdateTodoStatus!) {\n    updateTodoStatus(id: $id, input: $input) {\n      id\n      text\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTodoStatus($id: ID!, $input: UpdateTodoStatus!) {\n    updateTodoStatus(id: $id, input: $input) {\n      id\n      text\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTodo($id: ID!) {\n    deleteTodo(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTodo($id: ID!) {\n    deleteTodo(id: $id) {\n      id\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;