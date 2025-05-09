package ofrep

import (
	"net/http"

	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apiserver/pkg/authorization/authorizer"
	genericapiserver "k8s.io/apiserver/pkg/server"
	"k8s.io/kube-openapi/pkg/common"
	"k8s.io/kube-openapi/pkg/spec3"

	"github.com/gorilla/mux"
	"github.com/grafana/grafana/pkg/services/apiserver/builder"
)

var _ builder.APIGroupBuilder = (*APIBuilder)(nil)
var _ builder.APIGroupRouteProvider = (*APIBuilder)(nil)
var _ builder.APIGroupVersionProvider = (*APIBuilder)(nil)

type APIBuilder struct{}

func NewAPIBuilder() *APIBuilder {
	return &APIBuilder{}
}

func RegisterAPIService(apiregistration builder.APIRegistrar) *APIBuilder {
	builder := NewAPIBuilder()
	apiregistration.RegisterAPI(builder)
	return builder
}

func (b *APIBuilder) GetAuthorizer() authorizer.Authorizer {
	return nil
}

func (b *APIBuilder) GetGroupVersion() schema.GroupVersion {
	return schema.GroupVersion{
		Group:   "ofrep",
		Version: "v1",
	}
}

func (b *APIBuilder) InstallSchema(scheme *runtime.Scheme) error {
	return nil
}

func (b *APIBuilder) UpdateAPIGroupInfo(apiGroupInfo *genericapiserver.APIGroupInfo, opts builder.APIGroupOptions) error {
	return nil
}

func (b *APIBuilder) GetOpenAPIDefinitions() common.GetOpenAPIDefinitions {
	return func(ref common.ReferenceCallback) map[string]common.OpenAPIDefinition {
		return map[string]common.OpenAPIDefinition{}
	}
}

func (b *APIBuilder) GetAPIRoutes(gv schema.GroupVersion) *builder.APIRoutes {
	return &builder.APIRoutes{
		Root: []builder.APIRouteHandler{
			{
				Path: "evaluate/flag",
				Spec: &spec3.PathProps{
					Get: &spec3.Operation{},
				},
				Handler: b.handleFlagsList,
			},
			{
				Path: "evaluate/{flagKey}",
				Spec: &spec3.PathProps{
					Get: &spec3.Operation{},
				},
				Handler: b.handleEvaluateFlag,
			},
		},
	}
}

func (b *APIBuilder) handleFlagsList(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, err := w.Write([]byte("flags list"))
	if err != nil {
		panic(err)
	}
}

func (b *APIBuilder) handleEvaluateFlag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	flagKey := vars["flagKey"]
	if flagKey == "" {
		http.Error(w, "flagKey parameter is required", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, err := w.Write([]byte(flagKey))
	if err != nil {
		panic(err)
	}
}
